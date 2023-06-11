import { NestFactory } from '@nestjs/core';
import { RedisDynamicModule } from './redis-dynamic.module';

async function bootstrap() {
  const app = await NestFactory.create(RedisDynamicModule);
  await app.listen(3000);
}
bootstrap();
