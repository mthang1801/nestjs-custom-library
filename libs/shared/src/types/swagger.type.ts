import { ENUM_FAV_ICON, ENUM_SWAGGER_THEME } from '../constants/enum';

export type SwaggerSetupOptions = {
	theme?: keyof typeof ENUM_SWAGGER_THEME;
	title?: string;
	icon?: keyof typeof ENUM_FAV_ICON;
	apiEndpoint?: string;
	description?: string;
	version?: string;
};
