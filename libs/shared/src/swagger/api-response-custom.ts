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
	CreatedResponseDto,
	PaginatedResponseDto,
	SwaggerBadGatewayResponseDto,
	SwaggerBadRequestResponseDto,
	SwaggerUnAuthorizedResponseDto,
} from './response';
import type { ApiResponseDataType } from './types/swagger.type';

type TApiResponse<TModel> = {
	responseType?: TModel;
	summary: string;
	httpCode?: number;
	body?: any;
	headers?: Record<string, any>[];
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

export const ApiAbstractResponseCustom = <TModel extends Type<any>>({
	responseType,
	summary,
	httpCode,
}: TApiResponse<TModel>) =>
	applyDecorators(
		ApiHeadersResponse(),
		ApiExtraModels(AbstractResponseDto),
		ApiOperation({ summary: summary ?? (responseType?.name || '') }),
		ApiBadGatewayResponse({
			description: 'Server is not response',
			type: SwaggerBadGatewayResponseDto,
		}),
		ApiUnauthorizedResponse({
			description: 'User is not allow to access the resource',
			type: SwaggerUnAuthorizedResponseDto,
		}),
		ApiBadRequestResponse({
			description: 'Client send the bad data to server',
			type: SwaggerBadRequestResponseDto,
		}),
		HttpCode(httpCode || 200),
	);

export const ApiListResponseCustom = <TModel extends Type<any>>(
	properties: TApiResponse<TModel>,
) => {
	const { responseType } = properties;
	return applyDecorators(
		ApiAbstractResponseCustom(properties),
		ApiOkResponse({
			schema: {
				title: `ListResponseOf${responseType?.name}`,
				allOf: [
					{ $ref: getSchemaPath(PaginatedResponseDto<TModel>) },
					{
						properties: {
							data: ApiPropertyResoponseData('array', responseType),
						},
					},
				],
			},
		}),
	);
};

export const ApiResponseCustom = <TModel extends Type<any>>(
	properties: TApiResponse<TModel>,
) => {
	const { responseType, body } = properties;
	return applyDecorators(
		ApiAbstractResponseCustom(properties),
		body ? ApiBody({ type: body }) : ApiOkResponse(),
		ApiOkResponse({
			schema: {
				title: `ResponseCustom${responseType?.name || ''}`,
				allOf: [
					{ $ref: getSchemaPath(AbstractResponseDto<TModel>) },
					{
						properties: {
							data: ApiPropertyResoponseData('object', responseType),
						},
					},
				],
			},
		}),
	);
};

export const ApiCreatedResponseCustom = <TModel extends Type<any>>(
	properties: TApiResponse<TModel>,
) => {
	const { responseType, body } = properties;
	return applyDecorators(
		ApiAbstractResponseCustom(properties),
		body ? ApiBody({ type: body }) : ApiCreatedResponse(),
		ApiCreatedResponse({
			schema: {
				title: `ApiOkResponseOf${responseType?.name}`,
				allOf: [
					{ $ref: getSchemaPath(CreatedResponseDto<TModel>) },
					{
						properties: {
							data: ApiPropertyResoponseData('object', responseType),
						},
					},
				],
			},
		}),
	);
};
