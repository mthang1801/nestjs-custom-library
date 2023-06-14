import { DataType } from '../types';

export const valueToBoolean = (value: any) => {
	if ([true, 'true', 1, '1', 'yes', 'y'].includes(value?.toLowerCase()))
		return true;
	if ([false, 'false', 0, '0', 'no', 'n'].includes(value?.toLowerCase()))
		return false;
	return undefined;
};

export const typeOf = (value: any): DataType =>
	Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
