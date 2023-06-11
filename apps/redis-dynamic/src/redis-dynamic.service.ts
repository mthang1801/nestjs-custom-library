import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisDynamicService {
  getHello(): string {
    return 'Hello World!';
  }
}
