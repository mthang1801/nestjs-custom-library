import { RmqOptions } from '@nestjs/microservices';

export type RmqClientOptions = Exclude<RmqOptions['options'], 'transport'> & {
	name: string;
	isAck?: boolean;
};
