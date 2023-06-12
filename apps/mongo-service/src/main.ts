import { NestFactory } from '@nestjs/core';
import { MongoServiceModule } from './mongo-service.module';

async function bootstrap() {
  const app = await NestFactory.create(MongoServiceModule);
  await app.listen(3000);
}
bootstrap();
