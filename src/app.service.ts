import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): string {
    return 'Hello Nest on Lambda!';
  }

  pingDB(): string {
    return `test ${JSON.stringify(process.env)}`;
  }
}
