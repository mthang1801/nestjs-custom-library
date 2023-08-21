import { LibMongoService } from '@app/shared/mongodb/mongodb.service';
import { UtilService } from '@app/shared/utils/util.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	constructor(
		private readonly mongooseDynamicService: LibMongoService,
		private readonly utilService: UtilService,
	) {}

	async saveLogAction(payload) {
		// this.parseData(payload);
		// if (payload.exclusiveFields) this.handleExclusiveFields(payload);
		// if (
		// 	payload.actionType === 'UPDATE' &&
		// 	payload.oldData &&
		// 	!payload.newData
		// ) {
		// 	payload.newData = await this.mongooseDynamicService.findOne(
		// 		payload.metaCollectionName,
		// 		{
		// 			_id: new ObjectId(payload.oldData._id),
		// 		},
		// 	);
		// }
		// if (payload.oldData) {
		// 	payload.oldData = this.formatPopulateFields(
		// 		payload.oldData,
		// 		payload.populates,
		// 	);
		// }
		// await this.mongooseDynamicService.insertOne(
		// 	payload.collectionName,
		// 	payload,
		// );
	}

	// parseData(payload: AbstractType.LogActionPayload<any>) {
	// 	payload.newData = this.utilService.parseData(payload.newData);
	// 	payload.oldData = this.utilService.parseData(payload.oldData);
	// }

	// handleExclusiveFields(payload: AbstractType.LogActionPayload<any>) {
	// 	payload.exclusiveFields.forEach((field) => {
	// 		payload.newData && delete payload.newData[field];
	// 		payload.oldData && delete payload.oldData[field];
	// 	});
	// }

	// formatPopulateFields(data, populates) {
	// 	return Object.entries(data).reduce((res, [key, val]: [string, any]) => {
	// 		if (populates.includes(key)) {
	// 			if (typeOf(val) === 'array') {
	// 				res[key] = val.map(({ _id }) => ({
	// 					_id: new ObjectId(_id),
	// 				}));
	// 			} else {
	// 				res[key] = new ObjectId(val['_id']);
	// 			}
	// 		} else {
	// 			res[key] = val;
	// 		}
	// 		return res;
	// 	}, {});
	// }
}
