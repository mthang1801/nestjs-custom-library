import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { LibActionLogService } from './action-log.service';
import { ActionLogFilterQueryDto } from './dto/action-log-filter-query.dto';
@Controller('action-logs')
export class ActionLogController {
	constructor(private readonly actionLogService: LibActionLogService) {}
	@Get()
	async findAll(@Query() query: ActionLogFilterQueryDto) {
		console.log('********** Action Log *************');
		return this.actionLogService.findAll(query);
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.actionLogService.delete(id);
	}
}
