import { AbstractType } from '@app/shared/abstract/types/abstract.type';
import { LibMongoService } from '@app/shared/mongodb/mongodb.service';
import { typeOf } from '@app/shared/utils/function.utils';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class AppService {
	constructor(private readonly mongooseDynamicService: LibMongoService) {}

	async saveLogAction(payload: AbstractType.LogActionPayload<any>) {
		if (
			payload.actionType === 'UPDATE' &&
			payload.oldData &&
			!payload.newData
		) {
			payload.newData = await this.mongooseDynamicService.findOne(
				payload.metaCollectionName,
				{
					_id: new ObjectId(payload.oldData._id),
				},
			);
		}

		payload.oldData = this.formatPopulateFields(
			payload.oldData,
			payload.populates,
		);

		await this.mongooseDynamicService.insertOne(
			payload.collectionName,
			payload,
		);
	}

	formatPopulateFields(data, populates) {
		return Object.entries(data).reduce((res, [key, val]: [string, any]) => {
			if (populates.includes(key)) {
				if (typeOf(val) === 'array') {
					res[key] = val.map(({ _id }) => ({
						_id: new ObjectId(_id),
					}));
				} else {
					res[key] = new ObjectId(val['_id']);
				}
			} else {
				res[key] = val;
			}
			return res;
		}, {});
	}
}
