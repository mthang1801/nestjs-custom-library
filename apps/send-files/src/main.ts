import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SendFilesModule } from './send-files.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(SendFilesModule);
	app.useStaticAssets(join(__dirname, '../../..', 'public'));
	await app.listen(3000);
}
bootstrap();
