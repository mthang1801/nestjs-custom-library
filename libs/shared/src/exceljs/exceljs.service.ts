import { Injectable, NotFoundException } from '@nestjs/common';
import { Row, Workbook, Worksheet } from 'exceljs';
import * as fsExtra from 'fs-extra';
import * as _ from 'lodash';
import { join } from 'path';
import { typeOf } from '../utils/function.utils';
import { ExcelExtension } from './types/exceljs.type';
@Injectable()
export class ExceljsService {
	public columnsTemplates = {
		sampleCode: [
			{ header: 'id', key: 'id', width: 20 },
			{ header: 'name', key: 'name', width: 30 },
			{ header: 'email', key: 'email', width: 30 },
		],
	};

	private readonly templateDir = join(
		process.cwd(),
		'libs/shared/src/exceljs/templates',
	);

	protected workbook: Workbook | Worksheet;

	async initWorkBook() {
		this.workbook = await new Workbook();
		return this.workbook;
	}

	async readFile(
		filePath: string | Express.Multer.File,
		extension: ExcelExtension = 'xlsx',
	) {
		const workbook = new Workbook();
		this.workbook = await workbook[extension].readFile(
			typeOf(filePath) === 'string' ? filePath : filePath['path'],
		);
		return this.workbook as Workbook;
	}

	async writeFile(filename, extension: ExcelExtension = 'xlsx') {
		const filePath = this.getFilePath(filename);
		await this.workbook[extension].writeFile(filePath);
		return filePath;
	}

	protected getFilePath(filename: string) {
		return join(this.templateDir, filename);
	}

	public getColumsKeys(template) {
		if (!this.columnsTemplates[template]) {
			throw new NotFoundException();
		}

		return this.columnsTemplates[template].map(({ key }) => key);
	}

	public getDataFromWorksheet(ws: Worksheet, template) {
		const keys = this.getColumsKeys(template);
		const data = [];
		ws.eachRow((row, rowIdx) => {
			if (!this.isKeysRow(row, keys)) {
				const rowData = {};
				row.eachCell((cell, colIdx) => {
					rowData[keys[colIdx - 1]] = cell.value?.['text'] || cell.value;
				});
				data.push(rowData);
			}
		});
		return data;
	}

	private isKeysRow(row: Row, keys: string[]) {
		return _.difference(row.values, keys).filter(Boolean).length === 0;
	}

	async removeFile(filePath) {
		await fsExtra.unlink(filePath);
	}
}
