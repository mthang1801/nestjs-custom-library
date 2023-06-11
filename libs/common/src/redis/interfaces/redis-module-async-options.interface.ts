import { ModuleMetadata, Type } from '@nestjs/common';
import { RedisConnectionOptions } from './redis-connection-options.interface';

export interface RedisModuleAsyncOptions
	extends Pick<ModuleMetadata, 'imports'> {
	useClass?: Type<RedisConnectionOptions>;
	useExisting?: Type<RedisConnectionOptions>;
	useFactory?: (...args: any) => Type<RedisConnectionOptions>;
	inject?: any[];
}
