import { LibRedisUtil } from '@app/shared/redis/redis.utils';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
	constructor(
		@Inject(CACHE_MANAGER) readonly cache: Cache,
		private readonly redisUtil: LibRedisUtil,
	) {}

	set(key: string, value: any, ttl = 0) {
		return this.cache.store.set(key, value, ttl);
	}

	get(key: string) {
		return this.cache.store.get(key);
	}

	mset(...args: any[]) {
		return this.cache.wrap(`MSET ${args[1]} ${args[2]} ${args[3]} ${args[4]}`);
	}

	@Timeout(Date.now.toString(), 500)
	async handle() {
		const keys = Array.from({ length: 5 }).map((_, i) => `key:${i + 1}`);
		const userTemplate: any = {
			name: 'John Doe',
			age: 30,
			gender: 'Male',
			is_active: true,
			last_seen_at: new Date(),
		};
		await this.set('user:1', userTemplate);

		const user = await this.get('user:1');

		const mSetData = keys.reduce((res, key) => {
			userTemplate.id = key;
			res.push({ [key]: userTemplate });
			return res;
		}, []);

		// const data = await this.multiCache.wrap('MGET user:1 user:2');
		// console.log(data);
	}
}
