import { ExceljsService } from '@app/shared/exceljs/exceljs.service';
import { Injectable } from '@nestjs/common';

const mockData = [
	{
		id: 1,
		name: 'Iliffe',
		email: 'biliffe0@issuu.com',
	},
	{
		id: 2,
		name: 'Grinyov',
		email: 'fgrinyov1@wordpress.com',
	},
	{
		id: 3,
		name: 'Vasyagin',
		email: 'lvasyagin2@odnoklassniki.ru',
	},
	{
		id: 4,
		name: 'Whatsize',
		email: 'nwhatsize3@amazon.de',
	},
	{
		id: 5,
		name: 'Harsum',
		email: 'jharsum4@meetup.com',
	},
	{
		id: 6,
		name: 'Smartman',
		email: 'asmartman5@ebay.com',
	},
	{
		id: 7,
		name: 'Skoughman',
		email: 'hskoughman6@wikimedia.org',
	},
	{
		id: 8,
		name: 'Cockrem',
		email: 'kcockrem7@e-recht24.de',
	},
	{
		id: 9,
		name: 'Gallaher',
		email: 'fgallaher8@blinklist.com',
	},
	{
		id: 10,
		name: 'Meneely',
		email: 'pmeneely9@weather.com',
	},
];
@Injectable()
export class AppService {
	constructor(private readonly exceljsService: ExceljsService) {}

	async exportFile() {
		console.log('testFile');
		const fileName = 'export_demo.xlsx';

		const wb = await this.exceljsService.initWorkBook();

		const ws1 = wb.addWorksheet('First Sheet');

		ws1.columns = this.exceljsService.columnsTemplates.sampleCode;

		mockData.forEach((data) => {
			ws1.addRow(data);
		});

		return await this.exceljsService.writeFile(fileName, 'xlsx');
	}

	async importFile(file: Express.Multer.File) {
		const wb = await this.exceljsService.readFile(file);
		const ws = wb.getWorksheet('First Sheet');

		const data = this.exceljsService.getDataFromWorksheet(ws, 'sampleCode');
	}
}
