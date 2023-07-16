import { HttpCode, Type, applyDecorators } from '@nestjs/common';
import {
    ApiBadGatewayResponse,
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiExtraModels,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
    getSchemaPath,
} from '@nestjs/swagger';
import {
    AbstractResponseDto,
    ApiHeadersResponse,
    BadGatewayResponseDto,
    BadRequestResponseDto,
    CreatedResponseDto,
    PaginatedResponseDto,
    UnAuthorizedResponseDto,
} from './response';

type TApiResponse<TModel> = {
	type?: TModel;
	summary: string;
	httpCode?: number;
};

export const ApiListResponseCustom = <TModel extends Type<any>>({
	type,
	summary,
	httpCode,
}: TApiResponse<TModel>) =>
	applyDecorators(
		ApiHeadersResponse(),
		ApiExtraModels(PaginatedResponseDto),
		ApiOperation({ summary: summary ?? type.name }),
		ApiBadGatewayResponse({
			description: 'Server is not response',
			type: BadGatewayResponseDto,
		}),
		ApiUnauthorizedResponse({
			description: 'User is not allow to access the resource',
			type: UnAuthorizedResponseDto,
		}),
		HttpCode(httpCode || 200),
		ApiOkResponse({
			schema: {
				title: `ListResponseOf${type.name}`,
				allOf: [
					{ $ref: getSchemaPath(PaginatedResponseDto<TModel>) },
					{
						properties: {
							data: {
								type: 'array',
								items: { type: 'object', $ref: getSchemaPath(type) },
							},
						},
					},
				],
			},
		}),
	);

export const ApiResponseCustom = <TModel extends Type<any>>({
	type,
	summary,
	httpCode,
}: TApiResponse<TModel>) =>
	applyDecorators(
		ApiHeadersResponse(),
		ApiExtraModels(AbstractResponseDto),
		ApiOperation({ summary: summary ?? (type?.name || '') }),
		ApiBadGatewayResponse({
			description: 'Server is not response',
			type: BadGatewayResponseDto,
		}),
		ApiUnauthorizedResponse({
			description: 'User is not allow to access the resource',
			type: UnAuthorizedResponseDto,
		}),
		ApiBadRequestResponse({
			description: 'Client send the bad data to server',
			type: BadRequestResponseDto,
		}),
		HttpCode(httpCode || 200),
		ApiOkResponse({
			schema: {
				title: `ResponseCustom${type.name}`,
				allOf: [
					{ $ref: getSchemaPath(AbstractResponseDto<TModel>) },
					{
						properties: {
							data: {
								type: 'object',
								$ref: getSchemaPath(type),
							},
						},
					},
				],
			},
		}),
	);

export const ApiCreatedResponseCustom = <TModel extends Type<any>>({
	type,
	summary,
	httpCode,
}: TApiResponse<TModel>) =>
	applyDecorators(
		ApiHeadersResponse(),
		ApiExtraModels(CreatedResponseDto),
		ApiOperation({ summary: summary ?? type.name }),
		HttpCode(httpCode || 201),
		ApiBadGatewayResponse({
			description: 'Server is not response',
			type: BadGatewayResponseDto,
		}),
		ApiUnauthorizedResponse({
			description: 'User is not allow to access the resource',
			type: UnAuthorizedResponseDto,
		}),
		ApiBadRequestResponse({
			description: 'Client send the bad data to server',
			type: BadRequestResponseDto,
		}),
		ApiCreatedResponse({
			schema: {
				title: `ApiOkResponseOf${type.name}`,
				allOf: [
					{ $ref: getSchemaPath(CreatedResponseDto<TModel>) },
					{
						properties: {
							data: {
								type: 'object',
								$ref: getSchemaPath(type),
							},
						},
					},
				],
			},
		}),
	);
