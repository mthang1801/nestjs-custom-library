import { Injectable } from '@nestjs/common';
import { RedisCommandArgument } from '@redis/client/dist/lib/commands';
import * as lodash from 'lodash';
import { UtilService } from '../utils/util.service';
import { HScanReply, HScanResponse } from './types/redis-client.type';
@Injectable()
export class LibRedisUtil {
	constructor(private readonly utilService: UtilService) {}

	setValue(value: RedisCommandArgument | number | any): string {
		return JSON.stringify(value);
	}

	getValue(value: string): string | number | object {
		return this.utilService.jsonParse(value);
	}

	mSetValue(mData: Array<Record<string, any>>): Array<string> {
		const mDataConvert = mData.map((item) => {
			const [key] = lodash.keys(item);
			const value = JSON.stringify(item[key]);
			return { [key]: value };
		});

		return mDataConvert.flatMap(Object.entries).flat(1);
	}

	formatHsetData(data) {
		return Object.entries(data).reduce((res, [key, val]: [string, any]) => {
			res[key] = JSON.stringify(val);
			return res;
		}, {});
	}

	hSetNotExists(value: any) {
		return this.utilService.isJsonString(value) ? value : JSON.stringify(value);
	}

	hmGetValues(data: string[]) {
		return data.map((item) => this.utilService.jsonParse(item));
	}

	hGetAllValues(data) {
		return Object.entries(data).reduce((res, [key, val]: [string, any]) => {
			res[key] = this.utilService.jsonParse(val);
			return res;
		}, {});
	}

	hVals(valueList: string[]) {
		return valueList.map((valueItem) => this.utilService.jsonParse(valueItem));
	}

	hScan(data: HScanReply): HScanResponse {
		const { cursor, tuples } = data;
		const convertTuplesToObject = tuples.reduce(
			(res, { field, value }: { field: string; value: any }) => {
				res[this.utilService.jsonParse(field)] =
					this.utilService.jsonParse(value);
				return res;
			},
			{},
		);

		return {
			cursor,
			data: convertTuplesToObject,
		};
	}
}
