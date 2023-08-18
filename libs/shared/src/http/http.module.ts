import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
	imports: [
		HttpModule.register({
			timeout: 30000,
			maxRedirects: 10,
		}),
	],
	exports: [HttpModule],
})
export class LibHttpModule {}
