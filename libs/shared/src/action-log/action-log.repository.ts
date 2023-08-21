import { ActionLog, ActionLogDocument } from '@app/shared/schemas';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CONNECTION_NAME } from '../mongodb';

@Injectable()
export class LibActionLogRepository {
	protected logger = new Logger(LibActionLogRepository.name);

	constructor(
		@InjectModel(ActionLog.name, CONNECTION_NAME.PRIMARY)
		readonly primaryModel: Model<ActionLogDocument>,
		@InjectModel(ActionLog.name, CONNECTION_NAME.SECONDARY)
		readonly secondaryModel: Model<ActionLogDocument>,
	) {}
}
