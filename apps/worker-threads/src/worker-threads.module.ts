import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { WorkerThreadsController } from './worker-threads.controller';
import { WorkerThreadsService } from './worker-threads.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
			validationSchema: Joi.object({
				AUTH_PORT: Joi.number().required(),
				JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
				JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),
				JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
				JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required(),
				NODE_ENV: Joi.valid('development', 'production').required(),
				TELEGRAM_ENALBE_NOTI: Joi.boolean().required(),
			}),
			expandVariables: true,
		}),
	],
	controllers: [WorkerThreadsController],
	providers: [WorkerThreadsService],
})
export class WorkerThreadsModule {}
