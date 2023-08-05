import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RedisCommandArgument } from '@redis/client/dist/lib/commands';
import { RedisClientType, SetOptions, createClient } from 'redis';
import { UtilService } from '../utils/util.service';
import { REDIS_CONNECTION_OPTIONS } from './constants/constants';
import { RedisConnectionOptions } from './interfaces';
import { LibRedisUtil } from './redis.utils';
import type {
  ExpireMode,
  ExpireTime,
  HScanReply,
  HScanResponse,
  ScanResponse,
} from './types/redis-client.type';

@Injectable()
export class LibRedisService {
	protected readonly logger = new Logger(LibRedisService.name);
	protected redisClient: RedisClientType = null;
	constructor(
		@Inject(REDIS_CONNECTION_OPTIONS)
		protected readonly redisConnectionOptions: RedisConnectionOptions,
		private readonly redisUtil: LibRedisUtil,
		private readonly utilService: UtilService,
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
		await this.redisClient.connect().then((value) => {
			this.redisClient.on('error', function (error) {
				console.log(error);
			});
			this.redisClient.on('connect', function (connect) {
				console.log('connected::', connect);
			});
		});
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

	public async mSet(mData: Array<Record<string, any>> | Record<string, any>) {
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
			console.log(
				'🚀 ~ file: redis.service.ts:98 ~ LibRedisService ~ mSetNotExists ~ mData:',
				mData,
			);
			console.log(
				'🚀 ~ file: redis.service.ts:94 ~ LibRedisService ~ mSetNotExists ~ mSetValue:',
				mSetValue,
			);
			return this.redisClient.MSETNX(mSetValue);
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	public async mGet(...args: string[] | any): Promise<Record<string, any>> {
		const mGetData = await this.redisClient.MGET(args.flat(1));
		return this.redisUtil.responseMGetData(args.flat(1), mGetData);
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
		return this.redisClient.TTL(key);
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
	 * @returns {Promise<ScanResponse>}
	 */
	public async scan(
		match = '*',
		cursor = 0,
		count = 20,
	): Promise<ScanResponse> {
		try {
			return this.redisClient.SCAN(cursor, { MATCH: match, COUNT: count });
		} catch (error) {
			return {
				cursor: 0,
				keys: [],
			};
		}
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
	 * Sets the specified fields to their respective values in the hash stored at key.
	 * This command overwrites any specified fields already existing in the hash.
	 * If key does not exist, a new key holding a hash is created.
	 * @param {string} key
	 * @param {field} string
	 * @param { value} string
	 * @returns
	 */
	public async hSetNotExists(
		key: RedisCommandArgument,
		field: RedisCommandArgument,
		value: any,
	) {
		const formatHsetData = await this.redisUtil.hSetNotExists(value);
		return this.redisClient.HSETNX(key, field, formatHsetData);
	}

	/**
	 * Return the value of fields in hash
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
	public async hmGet(key: RedisCommandArgument, ...fields: any[]) {
		try {
			const data = await this.redisClient.HMGET(key, fields.flat(1));
			return this.redisUtil.hmGetValues(fields.flat(1), data);
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

	/**
	 * Returns all values in hash
	 * @param {string} key
	 * @returns
	 */
	public async hVals(key: RedisCommandArgument): Promise<any[]> {
		try {
			const valuesList = await this.redisClient.HVALS(key);
			return this.redisUtil.hVals(valuesList);
		} catch (error) {
			return [];
		}
	}

	/**
	 * Increments the integer value of a field in a hash by a number.
	 * Uses 0 as initial value if the field doesn't exist.
	 * @param {string} key
	 * @param {field} string
	 * @param {increment} number
	 * @returns
	 */
	public async hIncrBy(
		key: RedisCommandArgument,
		field: RedisCommandArgument,
		increment?: number,
	): Promise<number> {
		return await this.redisClient.HINCRBY(key, field, increment ?? 0);
	}

	/**
	 * Increments the floating point value of a field by a number.
	 * Uses 0 as initial value if the field doesn't exist.
	 * @param {string} key
	 * @param {field} string
	 * @param {increment} number
	 * @returns
	 */
	public async hIncrByFloat(
		key: RedisCommandArgument,
		field: RedisCommandArgument,
		increment?: number,
	): Promise<number> {
		return Number(
			await this.redisClient.HINCRBYFLOAT(key, field, increment ?? 0),
		);
	}

	/**
	 * Deternmines whether a field exists in the hash
	 * @param {string} key
	 * @param {string} field
	 * @returns {Promise<boolean>}
	 */
	public async hExists(
		key: RedisCommandArgument,
		field: RedisCommandArgument,
	): Promise<boolean> {
		return await this.redisClient.HEXISTS(key, field);
	}

	/**
	 * Removes the specified fields from the hash stored at key.
	 * Specified fields that do not exist within this hash are ignored.
	 * If key does not exist, it is treated as an empty hash and this command returns 0.
	 * @param {string} key
	 * @param {string[]} fields
	 * @returns {Promise<number>}
	 */
	public async hDel(
		key: RedisCommandArgument,
		...fields: RedisCommandArgument[]
	) {
		return await this.redisClient.HDEL(key, fields);
	}

	/**
	 * Removes the specified fields from the hash stored at key.
	 * Specified fields that do not exist within this hash are ignored.
	 * If key does not exist, it is treated as an empty hash and this command returns 0.
	 * @param {string} key
	 * @param {string[]} fields
	 * @returns {Promise<HScanResponse>}
	 */
	public async hScan(
		key: string,
		match = '*',
		cursor = 0,
		count = 20,
	): Promise<HScanResponse> {
		try {
			const hScanResponse: HScanReply = await this.redisClient.HSCAN(
				key,
				cursor,
				{
					MATCH: match,
					COUNT: count,
				},
			);
			return await this.redisUtil.hScan(hScanResponse);
		} catch (error) {
			return {
				cursor: 0,
				data: null,
			};
		}
	}
	//#endregion

	/********************************************************
	 ************************* LIST ***********************
	 ********************************************************/
	/**
	 * Append One or more elements into a list. Create a key if it does not exists
	 * @param key
	 * @param elements
	 * @returns
	 */
	async push(key: string, ...elements: any[]) {
		const stringifyElementList = this.redisUtil.stringifyElementList(
			elements.flat(1),
		);
		return this.redisClient.RPUSH(key, stringifyElementList);
	}

	/**
	 * Inserts specified values at the tail of the list stored at key,
	 * only if key already exists and holds a list. In contrary to RPUSH,
	 * no operation will be performed when key does not yet exist.
	 * @param key
	 * @param elements
	 * @returns
	 */
	async pushExists(key: string, ...elements: any[]) {
		const stringifyElementList = this.redisUtil.stringifyElementList(
			elements.flat(1),
		);
		return this.redisClient.RPUSHX(key, stringifyElementList);
	}

	/**
	 * Remove and return the last element of the list stored a key
	 * @param {string} key
	 * @returns {Promise<any>}
	 */
	async pop(key: string): Promise<any> {
		const popElement = await this.redisClient.RPOP(key);
		return popElement && this.utilService.parseData(popElement);
	}

	/**
	 * Insert all the specified values at the head of the list stored at key.
	 * If key does not exist, it is created as empty list before performing the push operations.
	 * When key holds a value that is not a list, an error is returned.
	 * @param {string} key
	 * @param {any[]} elements
	 * @returns {Promise<number>}
	 */
	async unshift(key: string, ...elements: any[]): Promise<number> {
		const stringifyElementList = this.redisUtil.stringifyElementList(
			elements.flat(1),
		);
		return this.redisClient.LPUSH(key, stringifyElementList);
	}

	/**
	 * Removes and returns the first elements of the list stored at key.
	 * @param {string} key
	 * @returns {Promise<any>}
	 */
	async shift(key: string): Promise<any> {
		const shiftElement = await this.redisClient.LPOP(key);
		return shiftElement && this.utilService.parseData(shiftElement);
	}

	/**
	 * Inserts specified values at the head of the list stored at key,
	 * only if key already exists and holds a list. In contrary to LPUSH,
	 * no operation will be performed when key does not yet exist.
	 * @param {string} key
	 * @param {any[]} elements
	 * @returns {Promise<number>}
	 */
	async unshiftExists(key: string, ...elements: any[]): Promise<number> {
		const stringifyElementList = this.redisUtil.stringifyElementList(
			elements.flat(1),
		);
		return this.redisClient.LPUSHX(key, stringifyElementList);
	}

	/**
	 * Sets the list element at index to element.
	 * For more information on the index argument, see LINDEX.
	 * @param {string} key
	 * @param {number} index
	 * @param {any} element
	 * @returns {Promise<boolean>}
	 */
	async lSet(key: string, index: number, element: any): Promise<boolean> {
		const formatElement = this.utilService.stringify(element);
		return (await this.redisClient.LSET(key, index, formatElement)) === 'OK';
	}

	/**
	 * Returns the specified elements of the list stored at key.
	 * The offsets start and stop are zero-based indexes,
	 * with 0 being the first element of the list (the head of the list), 1 being the next element and so on.
	 * @param {string} key
	 * @param {number} start
	 * @param {number} end
	 * @returns {Promise<any[]>}
	 */
	async lRange(key: string, start = 0, end = -1): Promise<any[]> {
		const responseData = await this.redisClient.LRANGE(key, start, end);
		return this.redisUtil.parseElementList(responseData);
	}

	/**
	 *Removes the first count occurrences of elements equal to element from the list stored at key. 
   The count argument influences the operation in the following ways:
  * count > 0: Remove elements equal to element moving from head to tail.
  * count < 0: Remove elements equal to element moving from tail to head.
  * count = 0: Remove all elements equal to element.
  For example, LREM list -2 "hello" will remove the last two occurrences of "hello" in the list stored at list.

  Note that non-existing keys are treated like empty lists, so when key does not exist, the command will always return 0.
	 * @param {string} key
	 * @param {any} element
	 * @param {number} count
	 * @returns {Promise<number>}
	 */
	async lRem(key: string, element: any, count = 0) {
		return this.redisClient.LREM(
			key,
			count,
			this.utilService.stringify(element),
		);
	}

	/**
	 * Returns the length of the list stored at key. If key does not exist, it is interpreted as an empty list and 0 is returned. An error is returned when the value stored at key is not a list.
	 * @param {string} key
	 * @returns {Promise<number>}
	 */
	async lLen(key: string) {
		return this.redisClient.LLEN(key);
	}

	/**
	 * Inserts element in the list stored at key either before or after the reference value pivot.
	 * When key does not exist, it is considered an empty list and no operation is performed.\
	 * An error is returned when key exists but does not hold a list value.
	 * @param {string} key
	 * @param {any} pivot
	 * @param {any} element
	 * @param { 'BEFORE' | 'AFTER' } position
	 * @returns
	 */
	async lInsert(
		key: string,
		pivot: any,
		element: any,
		position: 'BEFORE' | 'AFTER' = 'BEFORE',
	): Promise<boolean> {
		return (
			(await this.redisClient.LINSERT(
				key,
				position,
				this.utilService.stringify(pivot),
				this.utilService.stringify(element),
			)) > 0
		);
	}
}
