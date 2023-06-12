import { Controller, Get } from '@nestjs/common';
import { MongoServiceService } from './mongo-service.service';

@Controller()
export class MongoServiceController {
  constructor(private readonly mongoServiceService: MongoServiceService) {}

  @Get()
  getHello(): string {
    return this.mongoServiceService.getHello();
  }
}
