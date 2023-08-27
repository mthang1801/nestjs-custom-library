import { AbstractType } from '../abstract/types/abstract.type';

export interface Response<T> {
	data: T;
}

export interface ResponseData<T> {
	success: boolean;
	statusCode: number;
	data: T | T[];
	metadata?: AbstractType.Metadata;
	message: string | string[];
}
