import { NestFactory } from '@nestjs/core';
import { SerializerModule } from './serializer.module';

async function bootstrap() {
	const app = await NestFactory.create(SerializerModule);
	await app.listen(3000);
}
bootstrap();
