import { Controller, Post } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
	constructor(private readonly reportService: ReportService) {}
	@Post()
	async reportSales() {
		return await this.reportService.reportSales();
	}
}
