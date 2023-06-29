import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		if (mongoose.Types.ObjectId.isValid(value))
			return new mongoose.Types.ObjectId(value);
		throw new BadRequestException('Id không hợp lệ.');
	}
}
