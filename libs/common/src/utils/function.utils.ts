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

export const recursivelyStripNullValues = (value: unknown): unknown => {
	if (Array.isArray(value)) {
		return value.map(recursivelyStripNullValues);
	}

	if (value instanceof Date) {
		return value;
	}

	if (value !== null && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, value]) => [
				key,
				recursivelyStripNullValues(value),
			]),
		);
	}
  
	if (value !== null) {
		return value;
	}
};
