import { RedisCommandArgument } from '@redis/client/dist/lib/commands';

export type ExpireTime = 'SECOND' | 'MILLISECONDS';

export type ExpireMode = 'NX' | 'XX' | 'GT' | 'LT';

export type ScanResponse = {
	cursor: number;
	keys: string[];
};

export type HScanTuple = {
	field: RedisCommandArgument;
	value: RedisCommandArgument;
};

export type HScanReply = {
	cursor: number;
	tuples: Array<HScanTuple>;
};

export type HScanResponse = {
	cursor: number;
	data: Record<string, any>;
};
