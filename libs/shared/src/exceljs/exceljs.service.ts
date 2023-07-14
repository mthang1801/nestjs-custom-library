import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Row, Workbook, Worksheet } from 'exceljs';
import * as fsExtra from 'fs-extra';
import * as _ from 'lodash';
import { join } from 'path';
import { typeOf } from '../utils/function.utils';
import { TEMPLATE_COLUMN_DEFINITION } from './constants/template-definition';
import {
	ExcelColumnDefinitionValue,
	ExcelExtension,
	ExcelHeaderColumn,
	ExcelTemplate,
} from './types/exceljs.type';
@Injectable()
export class ExceljsService {
	public columnsTemplates: typeof TEMPLATE_COLUMN_DEFINITION =
		TEMPLATE_COLUMN_DEFINITION;

	private readonly templateDir = join(
		process.cwd(),
		'libs/shared/src/exceljs/templates',
	);

	protected workbook: Workbook | Worksheet;

	public initWorkBook() {
		this.workbook = new Workbook();
		return this.workbook;
	}

	public async readFile(
		filePath: string | Express.Multer.File,
		extension: ExcelExtension = 'xlsx',
	) {
		const workbook = this.initWorkBook();
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

	public getColumsKeys(
		ws: Worksheet,
		templateDescription: ExcelColumnDefinitionValue,
	): ExcelHeaderColumn[] {
		if (!templateDescription) {
			throw new NotFoundException();
		}

		let columnKeys: ExcelHeaderColumn[] = [];
		ws.getRow(templateDescription.headerRowIndex).eachCell((cell, colNum) => {
			const { value } = cell.model;
			const [col] = cell.$col$row.split('$').filter(Boolean);
			if (templateDescription.metadata.some(({ header }) => header === value)) {
				columnKeys.push({ header: value, column: col });
			}
		});

		return columnKeys;
	}

	public getDataFromWorksheet(ws: Worksheet, template: ExcelTemplate) {    
		const templateDescription = this.columnsTemplates[template];
		const columnKeys = this.getColumsKeys(ws, templateDescription);
    
		this.validateTemplateIsMatching(columnKeys, templateDescription);

		const data = [];
		ws.eachRow((row, rowIdx) => {
			if (rowIdx > templateDescription.headerRowIndex) {
				const rowData = {};
				row.eachCell((cell) => {
					const [col] = cell.$col$row.split('$').filter(Boolean);
					const { header } = _.find(
						columnKeys,
						(item: ExcelHeaderColumn) => item.column === col,
					);

					const { key } = _.find(
						templateDescription.metadata,
						(metadata) => metadata.header === header,
					);
					if (key) {
						rowData[key] = cell.value;
					}
				});
				data.push(rowData);
			}
		});    
		return data;
	}

	validateTemplateIsMatching(
		columnKeys: ExcelHeaderColumn[],
		templateDescription,
	) {
		const requiredFields = [];

		templateDescription.metadata.forEach(({ header }) => {
			if (
				!columnKeys.some(({ header: columnHeader }) => columnHeader === header)
			) {
				requiredFields.push(header);
			}
		});

		const redundantFields = [];
		columnKeys.forEach(({ header: columnHeader }) => {
			if (
				!templateDescription.metadata.some(
					({ header }) => header === columnHeader,
				)
			) {
				redundantFields.push(columnHeader);
			}
		});

		if (requiredFields.length || redundantFields.length) {
			const requiredTextField = requiredFields.length
				? requiredFields.join(', ') + ' là bắt buộc.'
				: undefined;
			const redundantTextField = redundantFields.length
				? redundantFields.join(', ') + ' không nên tồn tại'
				: undefined;
			throw new BadRequestException(
				[requiredTextField, redundantTextField].filter(Boolean).join('\n'),
			);
		}
	}

	async removeFile(filePath) {
		await fsExtra.unlink(filePath);
	}
}
