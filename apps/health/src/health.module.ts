import {
  ENUM_QUEUES,
  LibRabbitMQModule,
  MongooseDynamicModule,
} from '@app/shared';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
		HttpModule,
		TerminusModule.forRoot({ logger: true, errorLogStyle: 'pretty' }),
		MongooseDynamicModule.forRootAsync(),
		LibRabbitMQModule.registerAsync({
			name: ENUM_QUEUES.HEALTH_CHECK,
		}),
	],
	controllers: [HealthController],
	providers: [HealthService],
})
export class HealthModule {}
