import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RedisCommandArgument } from '@redis/client/dist/lib/commands';
import { RedisClientType, SetOptions, createClient } from 'redis';
import { REDIS_CONNECTION_OPTIONS } from './constants/constants';
import { RedisConnectionOptions } from './interfaces';
import { LibRedisUtil } from './redis.utils';
import type { ExpireMode, ExpireTime } from './types/redis-client.type';

@Injectable()
export class LibRedisService {
	protected readonly logger = new Logger(LibRedisService.name);
	protected redisClient: RedisClientType = null;
	constructor(
		@Inject(REDIS_CONNECTION_OPTIONS)
		protected readonly redisConnectionOptions: RedisConnectionOptions,
		private readonly redisUtil: LibRedisUtil,
	) {}

	getUrl() {
		const { host, port, username, password } = this.redisConnectionOptions;
		if (username && password)
			return `redis://${username}:${password}@${host}:${port}`;
		return `redis://${host}:${port}`;
	}

	public async connect() {
		this.redisClient ??
			(this.redisClient = await createClient({
				url: this.getUrl(),
				username: this.redisConnectionOptions.username || undefined,
				password: this.redisConnectionOptions.password || undefined,
			}));
		await this.redisClient.connect();
		this.logger.log(`Redis Server has connected to ${this.getUrl()}`);
	}

	protected async disconnect() {
		if (this.redisClient) {
			await this.redisClient.disconnect();
			this.logger.log(`Redis server has disconnected from ${this.getUrl()}`);
		}
	}

	async ping(message?: string): Promise<string> {
		return this.redisClient.ping(message);
	}

	/********************************************************
	 ************************* STRING ***********************
	 ********************************************************/
	//#region String
	public async set(
		key: string,
		value: RedisCommandArgument | number | any,
		options?: SetOptions,
	) {
		try {
			const setValue = this.redisUtil.setValue(value);
			return this.redisClient.SET(key, setValue, options);
		} catch (error) {
			console.log(error.stack);
			throw new BadRequestException(error);
		}
	}

	public async get(key: RedisCommandArgument) {
		const value = await this.redisClient.GET(key);
		return this.redisUtil.getValue(value);
	}

	public async mSet(mData: Array<Record<string, any>>) {
		try {
			const mSetValue = this.redisUtil.mSetValue(mData);
			return this.redisClient.MSET(mSetValue);
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	public async mSetNotExists(mData: Array<Record<string, any>>) {
		try {
			const mSetValue = this.redisUtil.mSetValue(mData);
			return this.redisClient.MSETNX(mSetValue);
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	public async mGet(...keys: string[]): Promise<Record<string, any>[]> {
		const mGetData = await this.redisClient.MGET(keys);
		return mGetData.map((data, i) => ({ [keys[i]]: data }));
	}

	public async keys(pattern: string): Promise<string[]> {
		return this.redisClient.KEYS(pattern);
	}

	/**
	 * Plus 1 by a key
	 * @param {string} key
	 * @param {number} num
	 * @returns
	 */
	public async incr(key: string) {
		return this.redisClient.INCR(key);
	}

	/**
	 * Decrement 1 by a key
	 * @param {string} key
	 * @param {number} num
	 * @returns
	 */
	public async decr(key: string) {
		return this.redisClient.DECR(key);
	}

	/**
	 * Increment given number by key
	 * @param {string} key
	 * @param {number} num
	 * @returns
	 */
	public async incrBy(key: string, num: number) {
		return this.redisClient.INCRBY(key, num);
	}

	/**
	 * Decrement given number by key
	 * @param {string} key
	 * @param {number} num
	 * @returns
	 */
	public async decrBy(key: string, num: number) {
		return this.redisClient.DECRBY(key, num);
	}

	/**
	 * Check if keys eixsts
	 * @param {string[]} keys
	 * @returns
	 */
	public async exists(...keys: string[]): Promise<boolean> {
		return (await this.redisClient.EXISTS(keys)) !== 0;
	}

	/**
	 * Check Time To Live of key,
	 * if result is -2 , the key do not exist
	 * if result is -1, the key exist permanent
	 * if result more than 0, the key exists n seconds
	 * @param {strting} key
	 * @returns {number}
	 */
	public async ttl(key: string) {
		return this.redisClient.ttl(key);
	}

	/**
	 *  set key expire following seconds or milliseconds mode
	 * @param {string} key
	 * @param {number} duration
	 * @param {SECOND | MILLISECONDS} mode
	 * @returns
	 */
	public async expire(
		key: string,
		duration: number,
		mode: ExpireTime = 'SECOND',
	) {
		return mode === 'SECOND'
			? this.redisClient.EXPIRE(key, duration)
			: this.redisClient.PEXPIRE(key, duration);
	}

	/*
	 * Set key expired at with mode
	 * @param {string} key
	 * @param {Date | number} timestamp
	 * @param {'NX' | 'XX' | 'GT' | 'LT'}mode
	 * @returns
	 */
	public async expireAt(
		key: string,
		timestamp: Date | number,
		mode?: ExpireMode,
	) {
		return this.redisClient.EXPIREAT(key, timestamp, mode);
	}

	/**
	 * return the string value of key after deleting the key
	 * @param {string} key
	 */
	public async getDel(key: string): Promise<string> {
		return this.redisClient.GETDEL(key);
	}

	/**
	 * Delete one or more keys
	 * @param {string[]} keys
	 * @returns {numberr}
	 */
	public async del(...keys: string[]): Promise<number> {
		return this.redisClient.DEL(keys);
	}

	/**
	 * Iterates over the key names in redis
	 * @param {number} cursor
	 * @param {string} match
	 * @param {number} count
	 * @returns
	 */
	public async scan(match: string, cursor = 0, count = 20) {
		return this.redisClient.SCAN(cursor, { MATCH: match, COUNT: count });
	}
	//#endregion

	/********************************************************
	 ************************* HASH ***********************
	 ********************************************************/
	//#region Hash
	/**
	 * Set the values for multiple fields
	 * @param key
	 * @param data
	 * @returns
	 */
	public async hset(key: RedisCommandArgument, data: Record<string, any>) {
		const formatHsetData = await this.redisUtil.formatHsetData(data);
		return this.redisClient.HSET(key, formatHsetData);
	}

	/**
	 * Return the value of fields  in hash\
	 * @param key
	 * @param field
	 * @returns
	 */
	public async hget(key: RedisCommandArgument, field: RedisCommandArgument) {
		return this.redisClient.HGET(key, field);
	}

	/**
	 * Return the value of all fields in hash
	 * @param key
	 * @param field
	 * @returns
	 */
	public async hmGet(
		key: RedisCommandArgument,
		...fields: RedisCommandArgument[]
	) {
		try {
			const data = await this.redisClient.HMGET(key, fields);
			return this.redisUtil.hmGetValues(data);
		} catch (error) {
			return null;
		}
	}

	/**
	 * Return all the values of all fields in hash
	 * @param key
	 * @param field
	 * @returns
	 */
	public async hGetAll(key: RedisCommandArgument) {
		try {
			const hGetAllValues = await this.redisClient.HGETALL(key);
			return this.redisUtil.hGetAllValues(hGetAllValues);
		} catch (error) {
			return null;
		}
	}

	/**
	 * Return all fields in hash
	 * @param key
	 * @param field
	 * @returns
	 */
	public async hKeys(key: RedisCommandArgument) {
		try {
			return await this.redisClient.HKEYS(key);
		} catch (error) {
			return [];
		}
	}

	/**
	 * Return length of fields in hash
	 * @param key
	 * @param field
	 * @returns
	 */
	public async hLen(key: RedisCommandArgument) {
		try {
			return await this.redisClient.HLEN(key);
		} catch (error) {
			return 0;
		}
	}
	//#endregion
}
