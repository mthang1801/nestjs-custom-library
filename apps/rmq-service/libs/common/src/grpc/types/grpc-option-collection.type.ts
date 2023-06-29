import { ClientProviderOptions, GrpcOptions } from '@nestjs/microservices';

export type GrpcServerClient = GrpcOptions | ClientProviderOptions;

export type GrpcOptionCollection = Record<string, GrpcServerClient>;
