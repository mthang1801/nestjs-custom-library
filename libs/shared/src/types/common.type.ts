import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { ENUM_TOKEN_TYPE } from '../constants/enum';
import { User } from '../schemas';

export type UserRequest = Request & User;

export type TokenPayload = {
	id: string;
};

export type CookieToken = {
	token: string;
	cookie: string;
};

export type TokenPair = {
	accessToken: string;
	refreshToken: string;
};

export type TokenKey = keyof typeof ENUM_TOKEN_TYPE;
export type TokenType = (typeof ENUM_TOKEN_TYPE)[TokenKey];

export type ReadOnly<T> = {
	+readonly [K in keyof T]: T[K];
};

export type Setters<T> = {
	[K in keyof T & string as `set${Capitalize<K>}`]: (value: T[K]) => void;
};

export type Getters<T> = {
	[K in keyof T & string as `get${Capitalize<K>}`]: () => T[K];
};

export type Mapped<T> = {
	readonly [K in keyof T]+?: T[K];
};

export type DeepReadonly<T> = {
	readonly [K in keyof T]: DeepReadonly<T[K]>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
declare type ClassDecorator = <TFunction extends Function>(
	target: TFunction,
) => TFunction | void;

export type UploadFileOptions = {
	fieldName: string;
	path: string;
	limit?: MulterOptions['limits'];
	fileFilter?: MulterOptions['fileFilter'];
};

export type UploadFilesOptions = {
	fieldName: string;
	maxCount?: number;
	path: string;
	limit?: MulterOptions['limits'];
	fileFilter?: MulterOptions['fileFilter'];
};
