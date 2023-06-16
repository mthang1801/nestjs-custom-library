import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as mongoose from 'mongoose';
import { MongoServiceModule } from './mongo-service.module';

async function bootstrap() {
	const app = await NestFactory.create(MongoServiceModule);
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
	app.use(cookieParser());
	mongoose.set('debug', true);
	await app.listen(3000);
}
bootstrap();
