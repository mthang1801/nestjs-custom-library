import { User as UserSchema } from '@app/shared/schemas';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const UserAuth = createParamDecorator(
	(_, ctx: ExecutionContext): typeof UserSchema => {
		const request: Request = ctx.switchToHttp().getRequest();
		return request?.user as typeof UserSchema;
	},
);
