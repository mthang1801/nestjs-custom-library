import { ApiHeaders, ApiProperty } from '@nestjs/swagger';

export class Metadata {
	@ApiProperty({ description: 'current page', example: 1 })
	currentPage: number;

	@ApiProperty({ description: 'page size', example: 10 })
	pageSize: number;

	@ApiProperty({ description: 'total', example: 1500 })
	total: number;
}

export class AbstractResponseDto<TData> {
	@ApiProperty({ example: 200 })
	protected statusCode?: number = 200;

	@ApiProperty({ description: 'data' })
	protected data: TData;

	@ApiProperty({ type: () => Metadata })
	protected metadata: Metadata = null;

	@ApiProperty({ example: 'Success' })
	protected message?: string = 'Success';
}

export class PaginatedResponseDto<TData> extends AbstractResponseDto<TData> {
	@ApiProperty()
	protected metadata: Metadata;
}

export class CreatedResponseDto<TData> extends AbstractResponseDto<TData[]> {
	@ApiProperty({ example: 201 })
	statusCode?: number;

	@ApiProperty({ description: 'data' })
	data: TData[];

	@ApiProperty({ example: null })
	metadata: Metadata = null;
}

export class ErrorResponseDto<TData> extends AbstractResponseDto<TData> {
	@ApiProperty({ example: 500 })
	protected statusCode?: number;

	@ApiProperty({ description: 'data', example: null })
	protected data: TData = null;

	@ApiProperty({ description: 'Metadata', example: null })
	protected metadata: Metadata = null;

	@ApiProperty({ example: 'Bad Request Exception' })
	protected message?: string;
}

export class BadRequestResponseDto extends ErrorResponseDto<any> {
	@ApiProperty({ example: 400 })
	protected statusCode?: number;

	@ApiProperty({ example: 'Bad Request Exception' })
	protected message?: string = 'Bad Request Exception';
}

export class BadGatewayResponseDto extends ErrorResponseDto<any> {
	@ApiProperty({ example: 502 })
	protected statusCode?: number;

	@ApiProperty({
		description: 'Server is not response in long time',
		example: 'Bad Gateway Exception',
	})
	protected message?: string = 'Bad Gateway Exception';
}

export class UnAuthorizedResponseDto extends ErrorResponseDto<any> {
	@ApiProperty({ example: 401 })
	protected statusCode?: number;

	@ApiProperty({ example: 'Unauthorized Exception' })
	protected message?: string = 'Unauthorized Exception';
}

export class BadRequestException extends ErrorResponseDto<any> {
	@ApiProperty({ example: 400 })
	protected statusCode?: number;

	@ApiProperty({ example: 'Bad Request Exception' })
	protected message?: string = 'Bad Request Exception';
}

export class NotFoundResponseDto extends ErrorResponseDto<any> {
	@ApiProperty({ example: 404 })
	protected statusCode?: number;

	@ApiProperty({ example: 'Unauthorized Exception' })
	protected message?: string = 'Unauthorized Exception';
}

export const ApiHeadersResponse = () =>
	ApiHeaders([
		{
			name: 'Authorization',
			description: 'Access Token',
			example:
				'ZWYzN2RkMmM3MDZkZDNjMzgyZDZiMDllNzVhZDE5MDIxYjkwMTAxODUyZWFkNTQ0NzM1MDQxMDVhMDM3NmM3MzBlZDQ1ZDc1N2JhOGU4NTA1NzI1OGMxNGM5YjhjZTk4NmY5MDJlNWRjZjViNTkwZTNmM2I3NmVjOGU0MjkzYjY=',
		},
		{
			name: 'Refresh Token',
			description: 'Refresh Token',
			example:
				'ZWYzN2RkMmM3MDZkZDNjMzgyZDZiMDllNzVhZDE5MDIxYjkwMTAxODUyZWFkNTQ0NzM1MDQxMDVhMDM3NmM3MzBlZDQ1ZDc1N2JhOGU4NTA1NzI1OGMxNGM5YjhjZTk4NmY5MDJlNWRjZjViNTkwZTNmM2I3NmVjOGU0MjkzYjY=',
		},
		{
			name: 'x-api-key',
			required: true,
			example: 'This is an api key',
		},
		{
			name: 'Content-Type',
			example: 'application/json',
		},
	]);
