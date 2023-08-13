export enum ENUM_STATUS {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export enum ENUM_GENDER {
	MALE = 'MALE',
	FEMALE = 'FEMALE',
	OTHER = 'OTHER',
}

export enum ENUM_LANGUAGES {
	ENGLISH = 'English',
	FRENCH = 'French',
	JAPANESE = 'Japanese',
	KOREAN = 'Korean',
	SPANISH = 'Spanish',
	VIETNAMESE = 'Vietnamese',
}

export enum ENUM_ROLES {
	SUPER_ADMIN = 'SUPER_ADMIN',
	ADMIN = 'ADMIN',
	SALE = 'SALE',
	SUPERVISER = 'SUPERVISER',
	USER = 'USER',
}

export enum PERMISSION {
	IS_PUBLIC_KEY = 'isPublic',
}

export enum ENUM_TOKEN_TYPE {
	ACCESS = 'ACCESS_TOKEN',
	REFRESH = 'REFRESH_TOKEN',
}

export enum ENUM_TOKEN_VALUE {
	ACCESS_TOKEN = 'AccessToken',
	REFRESH_TOKEN = 'RefreshToken',
}

export enum ENUM_SWAGGER_THEME {
	DARK = 'swagger-dark.css',
	FEELING_BLUE = 'swagger-feeling-blue.css',
	FLATTOP = 'swagger-flattop.css',
	GENERAL = 'swagger-general.css',
	MATERIAL = 'swagger-material.css',
	MUTED = 'swagger-muted.css',
	NEWSPAPER = 'swagger-newspaper.css',
	OUTLINE = 'swagger-outline.css',
}

export enum ENUM_FAV_ICON {
	DEFAULT = 'nestjs-logo.png',
	NT_OMS = 'nt-oms-logo.png',
}

export enum ENUM_PRODUCT_VISIBILITY {
	'ALL' = 'ALL',
	'CATEGORY' = 'CATEGORY',
	'SEARCH' = 'SEARCH',
	'RECOMMEND' = 'RECOMMEND',
	'ADVERTISE' = 'ADVERTISE',
	'PROMOTION' = 'PROMOTION',
}

export enum ENUM_ACTION {
	CREATE = 'CREATE',
	UPDATE = 'UPDATE',
	DELETE = 'DELETE',
}

export enum ENUM_EVENT_MODULE {
	PRODUCT = 'PRODUCT',
	INVENTORY = 'INVENTORY',
}

export enum ENUM_FORMAT_TYPE {
	JSON = 'json',
	XLSX = 'xlsx',
	PDF = 'pdf',
}

export enum ENUM_DATA_TYPE {
	BUFFER = 'buffer',
	JSON = 'json',
}

export enum ENUM_HASH_CODE_ALGORITHM {
	cyrb53 = 'cyrb53',
	hashFnv32a = 'hashFnv32a',
}

export enum ENUM_WEEK_DAY {
	SUNDAY = 'SUNDAY',
	MONDAY = 'MONDAY',
	TUESDAY = 'TUESDAY',
	WEDNESDAY = 'WEDNESDAY',
	THURSDAY = 'THURSDAY',
	FRIDAY = 'FRIDAY',
	SATURDAY = 'SATURDAY',
}

export enum ENUM_UNIT_TIMESTAMP {
	MILISECCONDS = 'MILISECCONDS',
	SECONDS = 'SECONDS',
	MINUTES = 'MINUTES',
	HOURS = 'HOURS',
	DAYS = 'DAYS',
	WEEKS = 'WEEKS',
	MONTHS = 'MONTHS',
	YEARS = 'YEARS',
}

export enum ENUM_VALUE_DATA_TYPE {
	STRING = 'string',
	NUMBER = 'number',
	ARRAY = 'array',
	OBJECT = 'object',
	SYMBOL = 'symbol',
	BIGINT = 'bigint',
	UNDEFINED = 'undefined',
	NULL = 'null',
	BOOLEAN = 'boolean',
}

export enum ENUM_DATE_TIME {
	YYYY_MM_DD = 'YYYY-MM-DD',
	YYYYMMDDHHMMSS = 'YYYYMMDDHHmmss',
	START_OFFSET = 'T00:00:00.000+07:00',
	END_OFFSET = 'T23:59:59.999+07:00',
	YYYY_MM_DD_TIMEZONE = 'YYYY-MM-DD HH:mm:ss+07:00',
	TIME_OFFSET = '+07:00',
}

export enum ENUM_MODEL {
	PRODUCT = 'products',
	USER = 'users',
	POST = 'posts',
	CATEGORY = 'categories',
	SYSTEM_LOG = 'system_logs',
}

export enum ENUM_ACTION_TYPE {
	CREATE = 'CREATE',
	UPDATE = 'UPDATE',
	DELETE = 'DELATE',
}

export const ENUM_NOTIFICATION_OBJECT = {
	GROUP: 'GROUP',
	PRIVATE: 'PRIVATE',
	GLOBAL: 'GLOBAL',
} as const;

export const ENUM_EVENTS = {
	CREATE: 'CREATE',
	UPDATE: 'UPDATE',
	DELETE: 'DELATE',
} as const;

export const ENUM_MESSENGER_TYPE = {
	TEXT: 'TEXT',
	IMAGE: 'IMAGE',
	DOCUMENT: 'DOCUMENT',
	VIDEO: 'VIDEO',
};

export const ENUM_MESSENGER_SCOPE = {
	PRIVATE: 'PRIVATE',
	GROUP: 'GROUP',
	GLOBAL: 'GLOBAL',
};
