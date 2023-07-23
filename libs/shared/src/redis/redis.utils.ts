import { Injectable } from '@nestjs/common';
import { RedisCommandArgument } from '@redis/client/dist/lib/commands';
import * as lodash from 'lodash';
import { UtilService } from '../utils/util.service';
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

	hmGetValues(data: string[]) {
		return data.map((item) => this.utilService.jsonParse(item));
	}

	hGetAllValues(data) {
		return Object.entries(data).reduce((res, [key, val]: [string, any]) => {
			res[key] = this.utilService.jsonParse(val);
			return res;
		}, {});
	}
}
