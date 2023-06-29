import { GrpcServerClientProvider } from '../grpc.helper';
import { ENUM_PROTO } from './enum';

export const GrpcServerClient = {
	MATH: GrpcServerClientProvider({
		packageName: ENUM_PROTO.MATH,
		protoPath: 'math/math.proto',
	}),
};
