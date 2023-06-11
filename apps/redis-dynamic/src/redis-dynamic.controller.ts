import { Controller, Get } from '@nestjs/common';
import { RedisDynamicService } from './redis-dynamic.service';

@Controller()
export class RedisDynamicController {
  constructor(private readonly redisDynamicService: RedisDynamicService) {}

  @Get()
  getHello(): string {
    return this.redisDynamicService.getHello();
  }
}
