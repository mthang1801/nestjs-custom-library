import * as bcrypt from 'bcryptjs';
import { DataType } from '../types';
import { Cryptography } from './cryptography.utils';

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
	const page = +params.page || 1;
	const limit = Math.min(params.limit || 20, 100);
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

export const debounce = (milliseconds = 3000) =>
	new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(true);
		}, milliseconds);
	});

export const hashedString = async (str: string) => bcrypt.hash(str, 10);
export const compareHashedString = async (str: string, hashedStr: string) =>
	bcrypt.compare(str, hashedStr);

export const genKeys = () => {
	const cryptography = new Cryptography();

	const publicKey = Cryptography.genPrivateKey();

	const { hashedData: secretKey, secretKey: privateKey } =
		cryptography.saltHashPassword(publicKey);

	return { publicKey, secretKey, privateKey };
};

export const has = (obj, property) => {
	const has = Object.prototype.hasOwnProperty;
	return has.call(obj, property);
};

export const generateRandomNumber = (numDigits = 6) =>
	Math.floor(
		Number(`10e${numDigits - 2}`) +
			Math.random() * 9 * Number(`10e${numDigits - 2}`),
	);

export const convertToNumber = (value: any): number =>
	!isNaN(Number(value)) ? Number(value) : 0;

export const isEmptyValue = (
	value: any,
	currentField: string = null,
	excludedKey: string[] = [],
) =>
	!excludedKey.includes(currentField) && [undefined, null, ''].includes(value);
