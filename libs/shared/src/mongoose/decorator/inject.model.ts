import { applyDecorators } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CONNECTION_NAME } from '../constants/connection-name';

export const MongooseInjectModel = (
	modelName: string,
	connectionName: CONNECTION_NAME = CONNECTION_NAME.PRIMARY,
): any => applyDecorators(InjectModel(modelName, connectionName));
