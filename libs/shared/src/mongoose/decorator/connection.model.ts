import { applyDecorators } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

export const MongooseInjectConnection = (modelName: string) =>
	applyDecorators(InjectConnection(modelName));
