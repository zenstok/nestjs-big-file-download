import { Injectable } from '@nestjs/common';
import { Readable } from 'node:stream';

@Injectable()
export class JsonService {
  createBigJsonFileStream(rowsLength = 1000000000): Readable {
    let currentRow = 1;

    const stream = new Readable({
      read() {
        if (currentRow === 1) {
          this.push('[');
          this.push(`{"id":${currentRow},"name":"element${currentRow}"},`);
        } else if (currentRow === rowsLength) {
          this.push(`{"id":${currentRow},"name":"element${currentRow}"}`);
          this.push(']');
          this.push(null);
        } else {
          this.push(`{"id":${currentRow},"name":"element${currentRow}"},`);
        }
        currentRow++;
      },
    });

    return stream;
  }
}
