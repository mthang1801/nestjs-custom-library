import { CONNECTION_NAME } from '@app/shared';
import { AbstractRepository } from '@app/shared/abstract';
import { UserRole, UserRoleDocument } from '@app/shared/schemas';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class UserRoleRepository extends AbstractRepository<UserRoleDocument> {
	protected logger = new Logger(UserRoleRepository.name);

	constructor(
		@InjectModel(UserRole.name, CONNECTION_NAME.PRIMARY)
		readonly primaryModel: Model<UserRoleDocument>,
		@InjectModel(UserRole.name, CONNECTION_NAME.SECONDARY)
		readonly secondaryModel: Model<UserRoleDocument>,
	) {
		super({ primaryModel, secondaryModel });
	}
}
