export type FindAllResponse<T> = {
	items: T[];
	count: number;
};

export type UpdateResponse = {
	acknowledged?: boolean;
	modifiedCount?: number;
	upsertedId?: any;
	upsertedCount?: number;
	matchedCount?: number;
};

export type RemoveOptions = {
	permanently: boolean;
};

export type ExtraUpdateOptions = {
	updateOnlyOne: boolean;
};

export type ModelInfo = {
	modelName: string;
	collectionName: string;
	schema: any;
};
