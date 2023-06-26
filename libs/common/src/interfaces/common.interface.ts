export interface Response<T> {
	data: T;
}

export interface Metadata {
	currentPage: number;
	pageSize: number;
	total: number;
}

export interface ResponseData<T> {
	success: boolean;
	statusCode: number;
	data: T;
	metadata?: Metadata;
	message: string | string[];
}
