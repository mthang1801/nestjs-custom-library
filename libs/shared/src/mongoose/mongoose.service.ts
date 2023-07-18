import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { ClientSession } from 'mongoose';

@Injectable()
export class MongooseDynamicService implements OnModuleInit {
	mongoose: typeof mongoose = null;
	constructor(private readonly configService: ConfigService) {}

	async onModuleInit() {
		this.mongoose = await this.connect();
	}

	connect(): Promise<typeof mongoose> {
		return new Promise((resolve, reject) => {
			mongoose
				.connect(this.configService.get<string>('MONGO_URI_PRIMARY'), {
					dbName: this.configService.get<string>('MONGO_DATABASE'),
				})
				.then((value: typeof mongoose) => resolve(value))
				.catch((err) => reject(err));
		});
	}

	async startTransaction(): Promise<ClientSession> {
		const session = await mongoose.startSession();
		session.startTransaction();
		return session;
	}
}
