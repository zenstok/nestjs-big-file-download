import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { JsonService } from './json.service';

@Injectable()
export class SimpleService {
  constructor(private readonly jsonService: JsonService) {}

  getBigFile(res: Response) {
    return this.jsonService.createBigJsonFileStream().pipe(res);
  }
}
