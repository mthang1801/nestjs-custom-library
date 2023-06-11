import { NestFactory } from '@nestjs/core';
import { RedisServiceModule } from './redis-service.module';

async function bootstrap() {
  const app = await NestFactory.create(RedisServiceModule);
  await app.listen(3000);
}
bootstrap();
