import { Module } from '@nestjs/common';
import { RedisDynamicController } from './redis-dynamic.controller';
import { RedisDynamicService } from './redis-dynamic.service';

@Module({
  imports: [],
  controllers: [RedisDynamicController],
  providers: [RedisDynamicService],
})
export class RedisDynamicModule {}
