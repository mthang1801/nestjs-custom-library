import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SseModule } from './sse.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(SseModule);
	app.useStaticAssets(join(process.cwd(), 'public'));
	await app.listen(3000);
}
bootstrap();
