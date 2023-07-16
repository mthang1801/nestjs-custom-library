import { HttpCode, Type, applyDecorators } from '@nestjs/common';
import {
	ApiBadGatewayResponse,
	ApiBadRequestResponse,
	ApiBody,
	ApiCreatedResponse,
	ApiExtraModels,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse,
	getSchemaPath,
} from '@nestjs/swagger';
import {
	ReferenceObject,
	SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {
	AbstractResponseDto,
	ApiHeadersResponse,
	BadGatewayResponseDto,
	BadRequestResponseDto,
	CreatedResponseDto,
	PaginatedResponseDto,
	UnAuthorizedResponseDto,
} from './response';
import type { ApiResponseDataType } from './types/swagger.type';

type TApiResponse<TModel> = {
	type?: TModel;
	summary: string;
	httpCode?: number;
	body?: any;
};

// eslint-disable-next-line @typescript-eslint/ban-types
const ApiPropertyResoponseData = <TModel extends string | Function>(
	objectType: ApiResponseDataType = 'object',
	referenceType: TModel = null,
): SchemaObject | ReferenceObject => {
	if (!referenceType) objectType = 'any';

	const result: any = {
		type: objectType,
	};

	switch (objectType) {
		case 'array':
			result.items = { type: 'object', $ref: getSchemaPath(referenceType) };
			break;
		case 'object':
			result.$ref = getSchemaPath(referenceType);
			break;
		case 'any':
			result.example = null;
	}

	return result;
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
				title: `ListResponseOf${type?.name}`,
				allOf: [
					{ $ref: getSchemaPath(PaginatedResponseDto<TModel>) },
					{
						properties: {
							data: ApiPropertyResoponseData('array', type),
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
	body,
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
		body ? ApiBody({ type: body }) : ApiOkResponse(),
		ApiOkResponse({
			schema: {
				title: `ResponseCustom${type.name}`,
				allOf: [
					{ $ref: getSchemaPath(AbstractResponseDto<TModel>) },
					{
						properties: {
							data: ApiPropertyResoponseData('object', type),
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
	body,
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
		body ? ApiBody({ type: body }) : ApiCreatedResponse(),
		ApiCreatedResponse({
			schema: {
				title: `ApiOkResponseOf${type.name}`,
				allOf: [
					{ $ref: getSchemaPath(CreatedResponseDto<TModel>) },
					{
						properties: {
							data: ApiPropertyResoponseData('object', type),
						},
					},
				],
			},
		}),
	);
