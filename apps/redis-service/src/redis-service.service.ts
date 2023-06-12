import { RedisService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisServiceService {
	constructor(private readonly redisService: RedisService) {}
	async getHello() {
		console.log(await this.redisService.ping());
		return 'Hello World!';
	}
}
