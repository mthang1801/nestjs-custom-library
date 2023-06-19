import { MongooseDynamicModule, QUEUES, RabbitMQModule } from '@app/common';
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
		RabbitMQModule.registerAsync({ name: QUEUES.HEALTH_CHECK }),
	],
	controllers: [HealthController],
	providers: [HealthService],
})
export class HealthModule {}
