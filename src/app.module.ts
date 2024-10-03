import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JsonService } from './json.service';
import { SimpleService } from './simple.service';
import { PerformantService } from './performant.service';
import { BufferService } from './buffer.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [JsonService, SimpleService, PerformantService, BufferService],
})
export class AppModule {}
