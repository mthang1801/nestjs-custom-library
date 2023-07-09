export type ExcelExtension = 'xlsx' | 'csv';

export type ExcelColumn = {
	header: string;
	key: string;
	width?: number;
};
