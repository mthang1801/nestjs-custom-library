import { CONNECTION_NAME } from '@app/common';
import { User, UserDocument } from '@app/common/schemas';
import { AbstractRepository } from '@app/shared';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
export class UserRepository extends AbstractRepository<UserDocument> {
	protected logger = new Logger(UserRepository.name);

	constructor(
		@InjectModel(User.name, CONNECTION_NAME.PRIMARY)
		readonly primaryModel: Model<UserDocument>,
		@InjectModel(User.name, CONNECTION_NAME.SECONDARY)
		readonly secondaryModel: Model<UserDocument>,
	) {
		super(primaryModel, secondaryModel);
	}
}
