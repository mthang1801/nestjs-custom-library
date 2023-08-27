import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { LibActionLogService } from './action-log.service';
import { ActionLogQueryFilterDto } from './dto/action-log-query-filter.dto';
@Controller('action-logs')
export class ActionLogController {
	constructor(private readonly actionLogService: LibActionLogService) {}
	@Get()
	async findAll(@Query() query: ActionLogQueryFilterDto) {
		console.log('********** Action Log *************');
		return this.actionLogService.findAll(query);
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.actionLogService.delete(id);
	}
}
