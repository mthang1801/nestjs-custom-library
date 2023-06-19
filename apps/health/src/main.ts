import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { HealthModule } from './health.module';

async function bootstrap() {
  const app = await NestFactory.create(HealthModule);
  await app.listen(5005,async () => Logger.log(`Serer Is running on ${await app.getUrl()}`, "HEALTH APPLICATION"));
}
bootstrap();
