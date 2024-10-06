import { Injectable } from '@nestjs/common';
import { JsonService } from './json.service';
import { Response } from 'express';

@Injectable()
export class BufferService {
  constructor(private readonly jsonService: JsonService) {}

  getBigFile(res: Response) {
    const jsonStream = this.jsonService.createBigJsonFileStream();

    const sendingChunkSize = 50 * 1024 * 1024; // 50 MiBs, Make sure to set the sending chunk size larger than the chunk buffer size to avoid unnecessary iterations in the while loop.
    let currentChunkSize = 0;
    let sendingChunk = Buffer.alloc(sendingChunkSize);

    jsonStream.on('data', (chunk: Buffer) => {
      while (chunk.byteLength > 0) {
        const availableSpace = sendingChunkSize - currentChunkSize;

        if (chunk.byteLength <= availableSpace) {
          // If the chunk fits within the remaining space
          chunk.copy(sendingChunk, currentChunkSize);
          currentChunkSize += chunk.byteLength;
          break;
        }

        // Fill the remaining space in the sendingChunk
        chunk.subarray(0, availableSpace).copy(sendingChunk, currentChunkSize);
        currentChunkSize += availableSpace;

        // Send the filled buffer
        const writable = res.write(sendingChunk);

        if (!writable) {
          jsonStream.pause();
        }

        // Reset for the next chunk
        sendingChunk = Buffer.alloc(sendingChunkSize);
        currentChunkSize = 0;
        chunk = chunk.subarray(availableSpace); // Process the rest of the chunk
      }
    });

    res.on('drain', () => {
      jsonStream.resume(); // Resume when writable
    });

    jsonStream.on('end', () => {
      // Send any remaining data that hasn't been flushed
      if (currentChunkSize > 0) {
        res.write(sendingChunk.subarray(0, currentChunkSize));
      }
      res.end();
    });

    jsonStream.on('error', (err) => {
      console.error(err); // Log error for debugging
      res.end();
    });
  }
}
