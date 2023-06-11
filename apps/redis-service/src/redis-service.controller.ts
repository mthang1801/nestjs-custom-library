import { Controller, Get } from '@nestjs/common';
import { RedisServiceService } from './redis-service.service';

@Controller()
export class RedisServiceController {
	constructor(private readonly redisServiceService: RedisServiceService) {}

	@Get()
	async getHello() {
		return this.redisServiceService.getHello();
	}
}
