import { ClientProviderOptions, GrpcOptions } from '@nestjs/microservices';

export type TGrpcOptionsCollection = Record<
	string,
	GrpcOptions | ClientProviderOptions
>;
