import { CONNECTION_NAME } from '../constants/connection-name';

export interface MongooseDynamicModuleOptions {
	connectionName?: CONNECTION_NAME;
}

export interface MongooseDynamicModuleForFeatureOptions {
	name: string;
	schema: any;
	connectionName?: CONNECTION_NAME;
}
