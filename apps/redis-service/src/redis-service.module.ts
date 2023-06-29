import { RedisConnectionOptions, RedisModule } from '@app/shared';
import redisConfig from '@app/shared/config/redis.config';
import { Module, Type } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisServiceController } from './redis-service.controller';
import { RedisServiceService } from './redis-service.service';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, load: [redisConfig] }),
		RedisModule.registerAsync({
			useFactory: (configService: ConfigService) =>
				configService.get<Type<RedisConnectionOptions>>('redis'),
			inject: [ConfigService],
		}),
	],
	controllers: [RedisServiceController],
	providers: [RedisServiceService],
})
export class RedisServiceModule {}
