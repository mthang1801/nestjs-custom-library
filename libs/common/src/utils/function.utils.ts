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

export const getPageSkipLimit = (
	params: any,
): {
	page: number;
	skip: number;
	limit: number;
} => {
	let { page, limit: perPage } = params;
	page = +page || 1;
	const limit = Math.min(perPage || 20, 100);
	const skip = (page - 1) * limit;
	return { page, skip, limit };
};
