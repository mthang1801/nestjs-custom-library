import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

@Injectable()
export class MongooseDynamicService {
	constructor(private readonly configService: ConfigService) {}

	connect() {
		return new Promise((resolve, reject) => {
			mongoose
				.connect(this.configService.get<string>('MONGO_URI_PRIMARY'), {
					dbName: this.configService.get<string>('MONGO_DATABASE'),
				})
				.then((value: typeof mongoose) => resolve(value))
				.catch((err) => reject(err));
		});
	}
}
