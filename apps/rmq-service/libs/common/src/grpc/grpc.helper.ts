import { Transport } from '@nestjs/microservices';
import { join, resolve } from 'path';
import { typeOf } from '../utils/function.utils';
import { GrpcServerClient } from './types/grpc-option-collection.type';
import { GrpcServerClientOptions } from './types/grpc-provider-options.type';

export const protoRootPath = join(
	__dirname,
	'../../../libs/common/src/grpc/protos',
);

export const GrpcServerClientProvider = ({
	name,
	url,
	packageName,
	protoPath,
}: GrpcServerClientOptions): GrpcServerClient => {
	console.log(join(protoRootPath, protoPath));
	return {
		name:
			name || typeOf(packageName) === 'array'
				? packageName.at(-1)
				: (packageName as string),
		transport: Transport.GRPC,
		options: {
			url,
			package: packageName,
			protoPath: resolve(protoRootPath, protoPath),
		},
	};
};
