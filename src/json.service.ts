import { Injectable } from '@nestjs/common';
import { Readable } from 'node:stream';

@Injectable()
export class JsonService {
  createBigJsonFileStream(rowsLength = 25000000): Readable {
    let currentRow = 1;
    rowsLength = this.getRandomLengthFromRange(rowsLength / 2, rowsLength);

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

  private getRandomLengthFromRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
