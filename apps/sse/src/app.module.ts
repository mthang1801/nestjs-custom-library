import { LibCoreModule } from '@app/shared/core/core.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
	imports: [LibCoreModule],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}