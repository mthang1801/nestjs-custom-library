import { TypeORMDynamicModule } from '@app/common/typeorm/typeorm.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, TypeORMDynamicModule.forRootAsync({logger : true})],
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}
