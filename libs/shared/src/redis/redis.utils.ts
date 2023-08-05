import { Injectable } from '@nestjs/common';
import { RedisCommandArgument } from '@redis/client/dist/lib/commands';
import * as lodash from 'lodash';
import { typeOf } from '../utils/function.utils';
import { UtilService } from '../utils/util.service';
import { HScanReply, HScanResponse } from './types/redis-client.type';
@Injectable()
export class LibRedisUtil {
	constructor(private readonly utilService: UtilService) {}

	setValue(value: RedisCommandArgument | number | any): string {
		return JSON.stringify(value);
	}

	getValue(value: string): string | number | object {
		return this.utilService.parseData(value);
	}

	mSetValue(
		mData: Array<Record<string, any>> | Record<string, any>,
	): Array<string> {
		if (typeOf(mData) === 'array') {
			const mDataConvert = mData.map((item) => {
				const [key] = lodash.keys(item);
				const value = this.utilService.parseData(item[key]);
				return { [key]: value };
			});

			return mDataConvert.flatMap(Object.entries).flat(1);
		}
		return Object.entries(mData).reduce((result, [key, val]: [string, any]) => {
			result.push(key);
			result.push(this.utilService.stringify(val));
			return result;
		}, []);
	}

	responseMGetData(keys: string[], data: any[]): Record<string, any> {
		return data.reduce(
			(result: Record<string, any>, curValue: any, curIdx: number) => {
				result[keys[curIdx]] = this.utilService.parseData(curValue);
				return result;
			},
			{},
		);
	}

	formatHsetData(data) {
		return Object.entries(data).reduce((res, [key, val]: [string, any]) => {
			res[key] = this.utilService.parseData(val);
			return res;
		}, {});
	}

	hSetNotExists(value: any) {
		return this.utilService.isJsonString(value) ? value : JSON.stringify(value);
	}

	hmGetValues(fields: string[], data: string[]) {
		return data.reduce(
			(result: Record<string, any>, curValue: any, curIdx: number) => {
				result[fields[curIdx]] = this.utilService.isJsonString(curValue)
					? JSON.parse(curValue)
					: curValue;
				return result;
			},
			{},
		);
	}

	hGetAllValues(data) {
		return Object.entries(data).reduce((res, [key, val]: [string, any]) => {
			res[key] = this.utilService.parseData(val);
			return res;
		}, {});
	}

	hVals(valueList: string[]) {
		return valueList.map((valueItem) => this.utilService.parseData(valueItem));
	}

	hScan(data: HScanReply): HScanResponse {
		const { cursor, tuples } = data;
		const convertTuplesToObject = tuples.reduce(
			(res, { field, value }: { field: string; value: any }) => {
				res[this.utilService.parseData(field)] =
					this.utilService.parseData(value);
				return res;
			},
			{},
		);

		return {
			cursor,
			data: convertTuplesToObject,
		};
	}

	stringifyElementList(elements: any[]): string[] {
		return elements
			.filter(Boolean)
			.map((element) => this.utilService.stringify(element));
	}

	parseElementList(elements: string[]) {
		return elements.map((element) => this.utilService.parseData(element));
	}
}
