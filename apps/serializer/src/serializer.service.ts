import { Injectable } from '@nestjs/common';

@Injectable()
export class SerializerService {
  getHello(): string {
    return 'Hello World!';
  }
}
