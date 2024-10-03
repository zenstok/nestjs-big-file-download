import { Controller, Get, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import { SimpleService } from './simple.service';
import { PerformantService } from './performant.service';
import { BufferService } from './buffer.service';

@Controller()
export class AppController {
  constructor(
    private readonly simpleService: SimpleService,
    private readonly performantService: PerformantService,
    private readonly bufferService: BufferService,
  ) {}

  @Get()
  readMe() {
    return `
     Call /simple to get a big file using a simple approach
     <br />
     Call /performant to get a big file using a performant approach
     <br />
     Call /buffer to get a big file using a buffer approach
    `;
  }

  @Get('simple')
  @Header('Content-Disposition', `attachment; filename="bigJson.json"`)
  @Header('Content-Type', 'application/json')
  @Header('Transfer-Encoding', 'chunked')
  getBigFileSimple(@Res() res: Response) {
    this.simpleService.getBigFile(res);
  }

  @Get('performant')
  @Header('Content-Disposition', `attachment; filename="bigJson.json"`)
  @Header('Content-Type', 'application/json')
  @Header('Transfer-Encoding', 'chunked')
  getBigFilePerformant(@Res() res: Response) {
    this.performantService.getBigFile(res);
  }

  @Get('buffer')
  @Header('Content-Disposition', `attachment; filename="bigJson.json"`)
  @Header('Content-Type', 'application/json')
  @Header('Transfer-Encoding', 'chunked')
  getBigFileBuffer(@Res() res: Response) {
    this.bufferService.getBigFile(res);
  }
}
