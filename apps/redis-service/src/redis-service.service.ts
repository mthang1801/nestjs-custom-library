import { LibRedisService } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';

@Injectable()
export class RedisServiceService {
	constructor(private readonly redisService: LibRedisService) {}

	// COMMENT: RedisStringExample
	async RedisStringExample() {
		const key = 'test';
		const value = {
			data: [
				{
					id: 'ptVHue',
					text: 'Điện thoại – Điện thoại iPhone – Quà tặng Tết 2023',
					redirect_url: '#',
					position: 0,
					status: 'A',
				},
				{
					id: '81gFS6',
					text: 'Điện thoại iPhone 14 – iPhone 14 Pro Max 128GB',
					redirect_url: '#',
					position: 1,
					status: 'A',
				},
				{
					id: 'v3mMl0',
					text: 'Điện thoại iPhone 12  – Điện thoại iPhone 13',
					redirect_url: '#',
					position: 2,
					status: 'A',
				},
			],
			title: 'Hỗ trợ khách hàng',
		};
		const productFeature = [
			{
				catalog_feature_id: 1,
				feature_name: 'Màn hình',
				catalog_feature_details: [
					{
						detail_code: 'sp_manhinh_congnghe',
						detail_id: 1,
						product_id: 13198,
						product_appcore_id: '50010621',
						value: 'OLED',
						detail_name: 'Công nghệ màn hình',
						feature_name: 'Màn hình',
						catalog_id: 1,
						catalog_feature_id: 1,
						status: 'A',
					},
					{
						detail_code: 'sp_manhinh_matkinhcamung',
						detail_id: 5,
						product_id: 13198,
						product_appcore_id: '50010621',
						value: 'Kính cường lực Ceramic Shield',
						detail_name: 'Mặt kính cảm ứng',
						feature_name: 'Màn hình',
						catalog_id: 1,
						catalog_feature_id: 1,
						status: 'A',
					},
					{
						detail_code: 'sp_manhinh_dophangiai',
						detail_id: 2,
						product_id: 13198,
						product_appcore_id: '50010621',
						value: '1290 x 2796 pixels',
						detail_name: 'Độ phân giải',
						feature_name: 'Màn hình',
						catalog_id: 1,
						catalog_feature_id: 1,
						status: 'A',
					},
					{
						detail_code: 'sp_manhinh_manhinhrong',
						detail_id: 3,
						product_id: 13198,
						product_appcore_id: '50010621',
						value: '6.7" - Tần số quét 120 Hz',
						detail_name: 'Màn hình rộng',
						feature_name: 'Màn hình',
						catalog_id: 1,
						catalog_feature_id: 1,
						status: 'A',
					},
				],
			},
			{
				catalog_feature_id: 2,
				feature_name: 'Camera sau',
				catalog_feature_details: [
					{
						detail_code: 'sp_camerasau_dophangiai',
						detail_id: 6,
						product_id: 13198,
						product_appcore_id: '50010621',
						value: 'Chính 48 MP & Phụ 12 MP, 12 MP',
						detail_name: 'Độ phân giải',
						feature_name: 'Camera sau',
						catalog_id: 1,
						catalog_feature_id: 2,
						status: 'A',
					},
					{
						detail_code: 'sp_camerasau_quayphim',
						detail_id: 7,
						product_id: 13198,
						product_appcore_id: '50010621',
						value: '4K@60fps',
						detail_name: 'Quay phim',
						feature_name: 'Camera sau',
						catalog_id: 1,
						catalog_feature_id: 2,
						status: 'A',
					},
					{
						detail_code: 'sp_camerasau_denflash',
						detail_id: 8,
						product_id: 13198,
						product_appcore_id: '50010621',
						value: 'Flash-LED',
						detail_name: 'Đèn Flash',
						feature_name: 'Camera sau',
						catalog_id: 1,
						catalog_feature_id: 2,
						status: 'A',
					},
					{
						detail_code: 'sp_camerasau_chupanhnangcao',
						detail_id: 186,
						product_id: 13198,
						product_appcore_id: '50010621',
						value:
							'Ban đêm (Night Mode) / Chống rung quang học (OIS) / Dolby Vision HDR / Góc rộng (Wide) / Góc siêu rộng (Ultrawide) / Nhận diện khuôn mặt / Quay chậm (Slow Motion) / Toàn cảnh (Panorama) / Time Lapse / Tự động lấy nét (AF)',
						detail_name: 'Chụp nâng cao',
						feature_name: 'Camera sau',
						catalog_id: 1,
						catalog_feature_id: 2,
						status: 'A',
					},
				],
			},
		];

		// TODO: Set Example
		const valueNumber = true;
		await this.redisService.set(key, valueNumber);

		// TODO: Get Example
		const result = await this.redisService.get(key);
		// console.log(result);

		// TODO: MSET Example
		const mKey1 = 'nSetKey:1';
		const mValue1 = 'value1';
		const mKey2 = 'nSetKey:2';
		const mValue2 = value;
		const mKey3 = 'nSetKey:3';
		const mValue3 = 123;
		const mKey4 = 'nSetKey:4';
		const mValue4 = productFeature;
		const mKey5 = 'nSetKey:5';
		const mValue5 = true;
		const mData = [
			{ [mKey1]: mValue1 },
			{ [mKey2]: mValue2 },
			{ [mKey3]: mValue3 },
			{ [mKey4]: mValue4 },
			{ [mKey5]: mValue5 },
		];
		const mKey6 = 'key:6';
		await this.redisService.mSet(mData);

		const msetObjectData = {
			[mKey1 + 'obj']: mValue1,
			[mKey2 + 'obj']: mValue2,
			[mKey3 + 'obj']: mValue3,
			[mKey4 + 'obj']: mValue4,
			[mKey5 + 'obj']: mValue5,
		};
		await this.redisService.mSet(msetObjectData);
		const mGetObjectdata = await this.redisService.mGet([
			mKey1 + 'obj',
			mKey2 + 'obj',
		]);
		console.log(
			'🚀 ~ file: redis-service.service.ts:187 ~ RedisServiceService ~ RedisStringExample ~ mGetObjectdata:',
			mGetObjectdata,
		);

		// TODO: MGET Example
		const mgetData = await this.redisService.mGet([
			mKey1,
			mKey6,
			mKey3,
			mKey4,
			mKey5,
		]);
		console.log(
			'🚀 ~ file: redis-service.service.ts:186 ~ RedisServiceService ~ RedisStringExample ~ mgetData:',
			mgetData,
		);

		// TODO: Keys List Example
		const keysList = await this.redisService.keys('key:*');
		// console.log(keysList);

		// TODO: Scan
		const scanListData = Array.from({ length: 100 }).map((_, i) => ({
			[`scan:${i + 1}`]: i + 1,
		}));
		await this.redisService.mSet(scanListData);
		const scanDataResult = await this.redisService.scan('scan:*', 0);
		// console.log(
		// 	'🚀 ~ file: redis-service.service.ts:198 ~ RedisServiceService ~ RedisStringExample ~ scanDataResult:',
		// 	scanDataResult,
		// );

		// TODO: INCR
		const postKey = 'POST:1:LIKE';
		await this.redisService.set(postKey, 0);
		await this.redisService.incr(postKey);
		const getIncr = await this.redisService.get(postKey);

		// TODO: EXISTS
		const isExists = await this.redisService.exists('POST:1:LIKE');
		const isManyExists = await this.redisService.exists(mKey1, mKey2, mKey6);
		// console.log(isExists);
		// console.log(isManyExists);

		// TODO: EXPIRE
		await this.redisService.expire(mKey1, 60, 'SECOND');
		await this.redisService.expire(mKey2, 30000, 'MILLISECONDS');
		await this.redisService.expireAt(mKey3, new Date('2023-07-23T17:50:00'));

		// TODO: TTL
		const ttl = await this.redisService.ttl(mKey1);
		// console.log(ttl);

		// TODO: GETDEL
		const getDelResult = await this.redisService.getDel(mKey1);
		// console.log(getDelResult);
	}

	//COMMENT: RedisHashExample
	async RedisHashExample() {
		//TODO : HSET
		const hKey1 = 'hkey:1';
		const hKey1Field1 = 'name';
		const hKey1Field2 = 'age';
		const hKey1Field3 = 'isActive';
		const hKey1Field4 = 'product';
		const hKey1Value1 = 'John Doe';
		const hKey1Value2 = 30;
		const hKey1Value3 = true;
		const hKey1Value4 = [
			{
				catalog_feature_id: 1,
				feature_name: 'Màn hình',
				is_active: true,
				catalog_feature_details: [
					{
						detail_code: 'sp_manhinh_congnghe',
						detail_id: 1,
						product_id: 13198,
						product_appcore_id: '50010621',
						value: 'OLED',
						detail_name: 'Công nghệ màn hình',
						feature_name: 'Màn hình',
						catalog_id: 1,
						catalog_feature_id: 1,
						status: 'A',
					},
					{
						detail_code: 'sp_manhinh_matkinhcamung',
						detail_id: 5,
						product_id: 13198,
						product_appcore_id: '50010621',
						value: 'Kính cường lực Ceramic Shield',
						detail_name: 'Mặt kính cảm ứng',
						feature_name: 'Màn hình',
						catalog_id: 1,
						catalog_feature_id: 1,
						status: 'A',
					},
					{
						detail_code: 'sp_manhinh_dophangiai',
						detail_id: 2,
						product_id: 13198,
						product_appcore_id: '50010621',
						value: '1290 x 2796 pixels',
						detail_name: 'Độ phân giải',
						feature_name: 'Màn hình',
						catalog_id: 1,
						catalog_feature_id: 1,
						status: 'A',
					},
					{
						detail_code: 'sp_manhinh_manhinhrong',
						detail_id: 3,
						product_id: 13198,
						product_appcore_id: '50010621',
						value: '6.7" - Tần số quét 120 Hz',
						detail_name: 'Màn hình rộng',
						feature_name: 'Màn hình',
						catalog_id: 1,
						catalog_feature_id: 1,
						status: 'A',
					},
				],
			},
			{
				catalog_feature_id: 2,
				feature_name: 'Camera sau',
				catalog_feature_details: [
					{
						detail_code: 'sp_camerasau_dophangiai',
						detail_id: 6,
						product_id: 13198,
						product_appcore_id: '50010621',
						value: 'Chính 48 MP & Phụ 12 MP, 12 MP',
						detail_name: 'Độ phân giải',
						feature_name: 'Camera sau',
						catalog_id: 1,
						catalog_feature_id: 2,
						status: 'A',
					},
					{
						detail_code: 'sp_camerasau_quayphim',
						detail_id: 7,
						product_id: 13198,
						product_appcore_id: '50010621',
						value: '4K@60fps',
						detail_name: 'Quay phim',
						feature_name: 'Camera sau',
						catalog_id: 1,
						catalog_feature_id: 2,
						status: 'A',
					},
					{
						detail_code: 'sp_camerasau_denflash',
						detail_id: 8,
						product_id: 13198,
						product_appcore_id: '50010621',
						value: 'Flash-LED',
						detail_name: 'Đèn Flash',
						feature_name: 'Camera sau',
						catalog_id: 1,
						catalog_feature_id: 2,
						status: 'A',
					},
					{
						detail_code: 'sp_camerasau_chupanhnangcao',
						detail_id: 186,
						product_id: 13198,
						product_appcore_id: '50010621',
						value:
							'Ban đêm (Night Mode) / Chống rung quang học (OIS) / Dolby Vision HDR / Góc rộng (Wide) / Góc siêu rộng (Ultrawide) / Nhận diện khuôn mặt / Quay chậm (Slow Motion) / Toàn cảnh (Panorama) / Time Lapse / Tự động lấy nét (AF)',
						detail_name: 'Chụp nâng cao',
						feature_name: 'Camera sau',
						catalog_id: 1,
						catalog_feature_id: 2,
						status: 'A',
					},
				],
			},
		];
		await this.redisService.hset(hKey1, {
			[hKey1Field1]: hKey1Value1,
			[hKey1Field2]: hKey1Value2,
			[hKey1Field3]: hKey1Value3,
			[hKey1Field4]: hKey1Value4,
		});

		// TODO: HGET
		const getHKey1Name = await this.redisService.hget(hKey1, hKey1Field1);
		console.log(
			'🚀 ~ file: redis-service.service.ts:381 ~ RedisServiceService ~ RedisHashExample ~ getHKey1Name:',
			getHKey1Name,
		);
		// TODO: HMGET
		const getHMValues = await this.redisService.hmGet(
			hKey1,
			hKey1Field1,
			hKey1Field2,
		);
		console.log(
			'🚀 ~ file: redis-service.service.ts:389 ~ RedisServiceService ~ RedisHashExample ~ getHMValues:',
			getHMValues,
		);

		// TODO: HMGET
		const getHMValuesArray = await this.redisService.hmGet(hKey1, [
			hKey1Field1,
			hKey1Field2,
		]);
		console.log(
			'🚀 ~ file: redis-service.service.ts:400 ~ RedisServiceService ~ RedisHashExample ~ getHMValuesArray:',
			getHMValuesArray,
		);

		//TODO: HGetAll
		const hGetAllValues = await this.redisService.hGetAll(hKey1);
		// console.log(hGetAllValues);

		//TODO: HKeys
		const hKeysValues = await this.redisService.hKeys(hKey1);
		// console.log(hKeysValues);

		//TODO: HLen
		const hKeysLen = await this.redisService.hLen(hKey1);
		// console.log(hKeysLen);

		//TODO: HVALS
		const hValsList = await this.redisService.hVals(hKey1);
		// console.log(hValsList);

		//TODO: HIncrBy
		const hIncrBy = await this.redisService.hIncrBy(hKey1, 'point2', 15);
		// console.log(typeOf(hIncrBy), hIncrBy);

		//TODO: HIncrByFloat
		const hIncrByFloat = await this.redisService.hIncrByFloat(
			hKey1,
			'point4',
			25.5,
		);
		// console.log(typeOf(hIncrByFloat), hIncrByFloat);

		//TODO: HEXISTS
		const hShoudExists = await this.redisService.hExists(hKey1, hKey1Field1);
		// console.log(
		// 	'🚀 ~ file: redis-service.service.ts:398 ~ RedisServiceService ~ RedisHashExample ~ hShoudExists:',
		// 	hShoudExists,
		// );
		const hShouldNotExists = await this.redisService.hExists(hKey1, 'tessst');
		// console.log(
		// 	'🚀 ~ file: redis-service.service.ts:400 ~ RedisServiceService ~ RedisHashExample ~ hShouldNotExists:',
		// 	hShouldNotExists,
		// );

		//TODO: HSCAN
		const hScan = await this.redisService.hScan(hKey1);
		console.log(hScan);

		//TODO: HDEL
		const deletedList = await this.redisService.hDel(
			hKey1,
			hKey1Field1,
			hKey1Field2,
			'test',
			'point1',
			'unknown',
		);
		// console.log(deletedList);
	}

	// COMMENT: RedisListExample

	@Timeout(Date.now().toString(), 500)
	async RedisListExample() {
		// TODO : RPUSH
		// const imageListData = [
		// 	'files/products/2023/6/17/1/1689588059627_samsung_galaxy_s23_ultra_1_didongviet.jpg',
		// 	'files/products/2023/4/31/1/1685524193541_samsung_galaxy_s23_ultra_thumb_didongviet_new.jpg',
		// 	'files/media/catalog/product/s/a/samsung-galaxy-s23-ultra-5g-mau-xanh_4.png',
		// 	'files/media/catalog/product/s/a/samsung-galaxy-s23-ultra-5g-didongviet_4.png',
		// 	'files/media/catalog/product/s/a/samsung-galaxy-s23-ultra-5g-mau-den-didongviet_4.png',
		// 	'files/media/catalog/product/s/a/samsung-galaxy-s23-ultra-5g-mau-trang-didongviet_4.png',
		// ];
		// const keyRight = 'list:push';
		// await this.redisService.push(keyRight, imageListData);
		//TODO: RPUSHX
		// const pushToUniqListResponse = await this.redisService.pushExists(
		// 	keyRight,
		// 	imageListData,
		// );
		// console.log(
		// 	'🚀 ~ file: redis-service.service.ts:477 ~ RedisServiceService ~ RedisListExample ~ pushToUniqListResponse:',
		// 	pushToUniqListResponse,
		// );
		//TODO: RPOP
		// const resultRpop = await this.redisService.pop(keyRight);
		// console.log(resultRpop);
		//TODO: LPUSH
		// const keyLeft = 'list:unshift';
		// const dataList = 2;
		// const resultUnshift = await this.redisService.unshift(keyLeft, dataList);
		// console.log(
		// 	'🚀 ~ file: redis-service.service.ts:493 ~ RedisServiceService ~ RedisListExample ~ resultUnshift:',
		// 	resultUnshift,
		// );
		//TODO : LPOP
		// const keyLeft = 'list:shift';
		// const dataShiftList = [5, 3];
		// await this.redisService.unshift(keyLeft, dataShiftList);
		// for (let i = 0; i < 100; i++) {
		// 	const result = await this.redisService.shift(keyLeft);
		// 	console.log(result);
		// }
		// const resultUnshift = await this.redisService.unshift(keyLeft, dataList);
		// console.log(
		// 	'🚀 ~ file: redis-service.service.ts:493 ~ RedisServiceService ~ RedisListExample ~ resultUnshift:',
		// 	resultUnshift,
		// );
		// TODO: LPUSHX
		// const resultUnshiftExists = await this.redisService.unshiftExists(
		// 	keyLeft,
		// 	dataList,
		// );
		// console.log(
		// 	'🚀 ~ file: redis-service.service.ts:493 ~ RedisServiceService ~ RedisListExample ~ resultUnshiftExists:',
		// 	resultUnshiftExists,
		// );
		//TODO: LSET
		// const listSetKey = 'list:set';
		// const listSetData = [1, 2, 3, 4, 5];
		// await this.redisService.push(listSetKey, listSetData);
		// const lSetResponse = await this.redisService.lSet(listSetKey, 1, 10);
		// console.log(lSetResponse);
		//TODO: LRANGE
		// const lRangeKey = 'list:lrange';
		// const startIdx = 1;
		// const endIdx = -1;
		// const listRangeData = [
		// 	1,
		// 	2,
		// 	3,
		// 	4,
		// 	5,
		// 	'a',
		// 	null,
		// 	undefined,
		// 	{},
		// 	true,
		// 	false,
		// ];
		// await this.redisService.push(lRangeKey, listRangeData);
		// const lRangeResponse = await this.redisService.lRange(
		// 	lRangeKey,
		// 	startIdx,
		// 	endIdx,
		// );
		// console.log(lRangeResponse);

		//TODO: LREM
		// const keyLrem = 'list:lrem';
		// const lremData = [1, 2, 3, 4, 5, 5, 6, 6, 7, 7, 5];
		// await this.redisService.push(keyLrem, lremData);
		// const lremResult = await this.redisService.lRem(keyLrem, 5);
		// console.log(
		// 	'🚀 ~ file: redis-service.service.ts:556 ~ RedisServiceService ~ RedisListExample ~ lremResult:',
		// 	lremResult,
		// );

		//TODO: LLEN
		// const keyLLen = 'list:llen';
		// const llenData = Array.from({ length: 20 }).map((_, i) => i + 1);
		// await this.redisService.push(keyLLen, llenData);
		// const listSize = await this.redisService.lLen(keyLLen);
		// console.log(
		// 	'🚀 ~ file: redis-service.service.ts:566 ~ RedisServiceService ~ RedisListExample ~ listSize:',
		// 	listSize,
		// );

		//TODO: LINSERT
		// const keyLInsert = 'list:insert';
		// const lInsertData = Array.from({ length: 20 }).map((_, i) => i + 1);
		// await this.redisService.push(keyLInsert, lInsertData);
		// await this.redisService.lInsert(keyLInsert, 10, 100, 'BEFORE');
	}
}
