import { LibCoreModule } from '@app/shared/core/core.module';
import { Module } from '@nestjs/common';
import { ReportModule } from './reports/report.module';

@Module({
	imports: [LibCoreModule, ReportModule],
})
export class AppModule {}
