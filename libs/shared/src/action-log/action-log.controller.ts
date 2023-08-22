import { Controller, Get, Query } from '@nestjs/common';
import { LibActionLogService } from './action-log.service';
import { ActionLogQueryFilterDto } from './dto/action-log-query-filter.dto';
@Controller('action-logs')
export class ActionLogController {
	constructor(private readonly actionLogService: LibActionLogService) {}
	@Get()
	async findAll(@Query() query: ActionLogQueryFilterDto) {
		return this.actionLogService.findAll(query);
	}
}
