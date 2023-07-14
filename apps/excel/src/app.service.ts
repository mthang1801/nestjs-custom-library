import * as mockData from '@app/shared/exceljs/data/users.json';
import { ExceljsService } from '@app/shared/exceljs/exceljs.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	constructor(private readonly exceljsService: ExceljsService) {}

	async exportFile() {
		const fileName = 'export_demo.xlsx';

		const wb = await this.exceljsService.initWorkBook();

		const ws1 = wb.addWorksheet('First Sheet');

		ws1.columns = this.exceljsService.columnsTemplates.sampleCode.metadata;

		mockData.forEach((data) => {
			ws1.addRow(data);
		});

		return await this.exceljsService.writeFile(fileName, 'xlsx');
	}

	async importFile(file: Express.Multer.File) {
		const wb = await this.exceljsService.readFile(file);

		wb.worksheets.forEach((ws, number) => {
			const data = this.exceljsService.getDataFromWorksheet(ws, "sampleCode");
		});
	}
}
