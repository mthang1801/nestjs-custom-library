import { Controller } from '@nestjs/common';
import { RedisServiceService } from './redis-service.service';

@Controller()
export class RedisServiceController {
	constructor(private readonly redisServiceService: RedisServiceService) {}
}
