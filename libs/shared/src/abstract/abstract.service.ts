import { ModelInfo } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { HydratedDocument, Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { AbstractSchema } from './abstract.schema';

@Injectable()
export abstract class AbstractService<
	T extends HydratedDocument<Document, AbstractSchema>,
> {
	protected abstract logger: Logger;
	protected writeModel: Model<T> = null;
	protected readModel: Model<T> = null;
	protected modelInfo: ModelInfo = null;
	constructor(readonly repository: AbstractRepository<T>) {
		this.writeModel = repository.primaryModel;
		this.readModel = repository.secondaryModel;
		this.modelInfo = repository.modelInfo;
	}

	async _create(payload: Partial<T> | Partial<T>[], extraData?: any) {
		const createData = await this.repository.create(payload);

		return createData;
	}
}
