import { NestFactory } from '@nestjs/core';
import { HealthModule } from './health.module';

async function bootstrap() {
  const app = await NestFactory.create(HealthModule);
  await app.listen(3000);
}
bootstrap();
