import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoServiceService {
	getHello(): string {
		return 'Hello World!';
	}
}
