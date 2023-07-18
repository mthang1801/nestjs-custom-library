import { AbstractRepository, CONNECTION_NAME } from '@app/shared';
import { User, UserDocument } from '@app/shared/schemas';
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
