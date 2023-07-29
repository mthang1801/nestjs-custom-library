import { ModuleMetadata } from '@nestjs/common';
import { ModelDefinition } from '@nestjs/mongoose';
import { CONNECTION_NAME } from '../constants/connection-name';
export interface LibMongoModuleOptions {
	connectionName?: CONNECTION_NAME;
}

export interface LibMongoModuleForFeatureOptions
	extends Pick<ModuleMetadata, 'imports'> {
	name: string;
	schema?: any;
	useFactory?: (
		...args: any
	) => ModelDefinition['schema'] | Promise<ModelDefinition['schema']>;
	inject?: any[];
	connectionName?: CONNECTION_NAME;
}
