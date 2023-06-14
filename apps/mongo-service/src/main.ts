import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as mongoose from 'mongoose';
import { MongoServiceModule } from './mongo-service.module';

async function bootstrap() {
	const app = await NestFactory.create(MongoServiceModule);
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	mongoose.set('debug', true);

	await app.listen(3000);
}
bootstrap();
