import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): string {
    return 'Hello ci/cd';
  }
}
