import {
  ENUM_HASH_CODE_ALGORITHM,
  ENUM_UNIT_TIMESTAMP,
  ENUM_WEEK_DAY,
} from '../constants/enum';

export type HashCodeAlgorithm = keyof typeof ENUM_HASH_CODE_ALGORITHM;
export type Weekday = keyof typeof ENUM_WEEK_DAY;
export type UnitTimestamp = keyof typeof ENUM_UNIT_TIMESTAMP;

export type GenerateRandomCode = {
	str: string;
	prefix?: string;
	suffix?: string;
	algorithm?: HashCodeAlgorithm;
};

export type DataType =
	| 'string'
	| 'number'
	| 'array'
	| 'object'
	| 'symbol'
	| 'bigint'
	| 'undefined'
	| 'null'
	| 'boolean';
