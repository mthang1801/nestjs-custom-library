import { ClientGrpcProxy, RpcException } from '@nestjs/microservices';

export class ErrorHandlingProxy extends ClientGrpcProxy {
	serializeError(err) {
		return new RpcException(err);
	}
}
