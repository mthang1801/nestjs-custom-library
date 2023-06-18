export type FindAllResponse<T> = {
	items: T[];
	count: number;
};

export type RemoveOptions = {
	permanently: boolean;
};
