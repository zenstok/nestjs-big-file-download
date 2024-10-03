import { Injectable } from '@nestjs/common';
import { JsonService } from './json.service';
import { Response } from 'express';

@Injectable()
export class PerformantService {
  constructor(private readonly jsonService: JsonService) {}

  getBigFile(res: Response) {
    const jsonStream = this.jsonService.createBigJsonFileStream();

    jsonStream.setEncoding('utf-8');

    let chunkSize = 0;
    let bigChunk = '';

    jsonStream.on('data', (chunk: string) => {
      bigChunk += chunk;
      chunkSize++;
      if (chunkSize === 1000) {
        const writable = res.write(bigChunk);
        if (!writable) {
          jsonStream.pause();
        }
        bigChunk = '';
        chunkSize = 0;
      }
    });
    res.on('drain', () => {
      jsonStream.resume(); // Resume reading when writable
    });
    jsonStream.on('error', (err) => {
      console.error(err);
      res.end();
    });
    jsonStream.on('end', () => {
      if (bigChunk.length) {
        res.write(bigChunk);
      }
      res.end();
    });
  }
}
