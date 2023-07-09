import { LibCoreModule } from '@app/shared/core/core.module';
import { LibExceljs } from '@app/shared/exceljs/exceljs.module';
import { LibI18nModule } from '@app/shared/i18n';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [LibCoreModule, LibI18nModule, ScheduleModule.forRoot(), LibExceljs],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
