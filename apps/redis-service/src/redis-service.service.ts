import { Injectable } from '@nestjs/common';
import { RedisService } from 'libs/common/src';

@Injectable()
export class RedisServiceService {
	constructor(private readonly redisService: RedisService) {}
	async getHello() {
		console.log(await this.redisService.ping());
		return 'Hello World!';
	}
}
