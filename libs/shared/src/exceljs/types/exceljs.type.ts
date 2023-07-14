import { CellValue } from 'exceljs';
import { TEMPLATE_COLUMN_DEFINITION } from '../constants/template-definition';

export type ExcelExtension = 'xlsx' | 'csv';

export type ExcelColumn = {
	header: string;
	key: string;
	width?: number;
};

export type ExcelHeaderColumn = {
	header: string | CellValue;
	column: string;
};

export type ExcelTemplate = keyof typeof TEMPLATE_COLUMN_DEFINITION;

export type ExcelMetadata = {
	header: string;
	key: string;
	width?: number;
};

export type ExcelColumnDefinitionValue = {
	metadata: ExcelMetadata[];
	headerRowIndex: number;
};

export type ExcelColumnDefinition = Record<
	ExcelTemplate,
	ExcelColumnDefinitionValue
>;
