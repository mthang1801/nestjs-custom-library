import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export const RequestBody = createParamDecorator(
	async (value: any, ctx: ExecutionContext) => {
		// extract headers

		const { body } = ctx.switchToHttp().getRequest();
		// Convert headers to DTO object
		const dto = plainToInstance(value, body);

		console.log('RequestBody::', dto);
		return await validateOrReject(dto).then(
			(res) => {
				console.log(`Header validated successfully..${res}`);
				return dto;
			},
			(err) => {
				if (err.length > 0) {
					//Get the errors and push to custom array
					const validationErrors = err.map((obj, key) =>
						Object.values(obj.constraints),
					);
					throw new BadRequestException(validationErrors);
				}
			},
		);
	},
);
