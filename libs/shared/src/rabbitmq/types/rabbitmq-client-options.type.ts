import { RmqOptions } from '@nestjs/microservices';

export type RmqClientOptions = Exclude<RmqOptions['options'], 'noAck'> & {
	name?: string; // apply for old version
	isAck?: boolean;
};
