import { LogActionPayload } from '@app/shared/abstract/types/abstract.type';
import { MongooseDynamicService } from '@app/shared/mongoose/mongoose.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	constructor(
		private readonly mongooseDynamicService: MongooseDynamicService,
	) {}

	async saveLogAction(payload: LogActionPayload<any>) {
		await this.mongooseDynamicService.insertOne(
			payload.collectionName,
			payload,
		);
	}
}
