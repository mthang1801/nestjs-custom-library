import { LibRedisUtil } from '@app/shared/redis/redis.utils';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from './cache.service';

@Module({
	imports: [
		CacheModule.register({
			store: redisStore as any,
			isGlobal: true,
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT,
			username: process.env.REDIS_USERNAME,
			password: process.env.REDIS_PASSWORD,
		}),
		ScheduleModule.forRoot(),
	],
	providers: [CacheService, LibRedisUtil],
	exports: [CacheService],
})
export class CacheServiceModule {}
