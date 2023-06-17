import {
  ClassSerializerContextOptions,
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Document } from 'mongoose';
import { FindAllResponse } from '../types';
export function MongooseClassSerialzierInterceptor(
	classToIntercept: Type,
): typeof ClassSerializerInterceptor {
	return class Interceptor extends ClassSerializerInterceptor {
		serialize(
			response: PlainLiteralObject | PlainLiteralObject[],
			options: ClassSerializerContextOptions,
		): PlainLiteralObject | PlainLiteralObject[] {
			return super.serialize(this.prepareResopnse(response), options);
		}

		private prepareResopnse(
			response:
				| PlainLiteralObject
				| PlainLiteralObject[]
				| FindAllResponse<PlainLiteralObject>,
		) {
			if (Array.isArray(response)) {
				return response.map(this.changePlainObjectToClass);
			}

			if (response.items) {
				return {
					count: response.count,
					items: this.prepareResopnse(response.items),
				};
			}

			return this.changePlainObjectToClass(response);
		}

		private changePlainObjectToClass(document: PlainLiteralObject) {
			if (document instanceof Document) {
				return plainToClass(classToIntercept, document.toJSON(), {
					excludePrefixes: ['_'],
				});
			}
			return document;
		}
	};
}
