import { Module } from '@nestjs/common';
import { ExceljsService } from './exceljs.service';

@Module({
	providers: [ExceljsService],
	exports: [ExceljsService],
})
export class LibExceljs {}
