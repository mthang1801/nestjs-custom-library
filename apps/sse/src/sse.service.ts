import { Injectable } from '@nestjs/common';

@Injectable()
export class SseService {
  getHello(): string {
    return 'Hello World!';
  }
}
