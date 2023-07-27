import { LibCoreModule } from '@app/shared/core/core.module';
import { Module } from '@nestjs/common';

@Module({
	imports: [LibCoreModule],
	providers: [],
})
export class AppModule {}
