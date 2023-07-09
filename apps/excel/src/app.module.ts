import { LibCoreModule } from '@app/shared/core/core.module';
import { LibI18nModule } from '@app/shared/i18n';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
	imports: [LibCoreModule, LibI18nModule],
	controllers: [AppController],
})
export class AppModule {}
