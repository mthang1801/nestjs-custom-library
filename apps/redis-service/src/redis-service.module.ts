import { LibRedisModule, RedisConnectionOptions } from '@app/shared';
import redisConfig from '@app/shared/config/redis.config';
import { Module, Type } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisServiceController } from './redis-service.controller';
import { RedisServiceService } from './redis-service.service';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		ConfigModule.forRoot({ isGlobal: true, load: [redisConfig] }),
		LibRedisModule.registerAsync({
			useFactory: (configService: ConfigService) => {
				console.log(configService.get('REDIS_HOST'));
				return configService.get<Type<RedisConnectionOptions>>('redis');
			},
			inject: [ConfigService],
		}),
	],
	controllers: [RedisServiceController],
	providers: [RedisServiceService],
})
export class RedisServiceModule {}
