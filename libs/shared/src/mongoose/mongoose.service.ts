import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import mongoose, { ClientSession } from 'mongoose';
import { Db } from 'typeorm';

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

	async collection(collectionName: string) {
		const db = await this.db();
		return db.collection(collectionName);
	}

	async db() {
		const client = await this.mongoClientConnect();
		return client.db(this.configService.get<string>('MONGO_DATABASE'));
	}

	async mongoClientConnect() {
		const client = new MongoClient(
			this.configService.get<string>('MONGO_URI_PRIMARY'),
		);
		await client.connect();
		return client;
	}

	mongoClientDisconnect(client: MongoClient) {
		setTimeout(() => {
			client.close();
		}, 500);
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	async mongoClientWrapper(fn: Function) {
		const client = await this.mongoClientConnect();
		const db = await client.db(
			this.configService.get<string>('MONGO_DATABASE'),
		);
		try {
			return fn(db);
		} catch (error) {
			throw new HttpException(error.message, error.status);
		} finally {
			this.mongoClientDisconnect(client);
		}
	}

	async insertOne(collectionName: string, payload: any) {
		return this.mongoClientWrapper((db: Db) =>
			db
				.collection(collectionName)
				.insertOne({ ...payload, created_at: new Date() }),
		);
	}
}
