import * as moment from 'moment';
export const dateFormatYMD = 'YYYY-MM-DD';
export const dateFormatDMY = 'DD-MM-YYYY';
export const dateFormatYMD_hms = 'YYYY-MM-DD HH:mm:ss';
export const dateFormatYMD_hm = 'YYYY-MM-DD hh:mm';
export const dateFormatDMY_hm = 'DD-MM-YYYY hh:mm';
export const dateFormatYMD_hmsA = 'YYYY-MM-DD hh:mm:ss a';
export const dateFormatYMD_hms24h = 'YYYY-MM-DD HH:mm:ss';
export const dateFormatDMY_hms24h = 'DD-MM-YYYY HH:mm:ss';
export const dateFormat_hms24h = 'HH:mm:ss';
export const dateFormatDM_hms = 'DD/MM hh:mm:ss';
export const dateFormatDM_hm = 'DD/MM hh:mm';
export const dateUTC = 'YYYY-MM-DDTHH:mm:ss.sssZ';
export const dateISO = '±YYYYYY-MM-DDTHH:mm:ss.sssZ';

export const formatMySQLTimeStamp = (
	timestamp: string | Date = new Date(),
): string => moment(timestamp).format(dateFormatYMD_hms);

export const formatDateTime = (timestamp: string | Date = new Date()) =>
	moment(timestamp).format('YYYY-MM-DD');

export const formatTime = (timestamp: string | Date = new Date()) =>
	moment(timestamp).format('HH:mm:ss');

export const checkValidTimestamp = (timestamp, format = dateUTC) =>
	moment(timestamp, format).isValid();

export const longDateFormatByLocale = (
	timestamp: string | number | Date = new Date(),
	locale = 'vi',
) => {
	moment.locale(locale);
	return moment(timestamp).format(dateFormatDMY_hms24h);
};

export const longDateFormatWithoutSecondByLocale = (
	timestamp: string | number | Date = new Date(),
	locale = 'vi',
) => {
	moment.locale(locale);
	return moment(timestamp).format(dateFormatDMY_hm);
};

export const dateTimeFormatByLocale = (
	timestamp: string | number | Date = new Date(),
	locale = 'vi',
) => {
	moment.locale(locale);
	return moment(timestamp).format(dateFormatDMY);
};
export const today = (dateFormat: string = dateFormatYMD) =>
	moment().format(dateFormat);

export const startOfDay = (
	date = new Date(),
	format: string = dateFormatYMD_hms24h,
): Date => new Date(moment(date).startOf('day').format(format));

export const endOfDay = (
	date = new Date(),
	format: string = dateFormatYMD_hms24h,
): Date => new Date(moment(date).endOf('day').format(format));

export const startOfMonth = (dateFormat) =>
	moment()
		.startOf('month')
		.format(dateFormat ? dateFormat : dateFormatYMD);

export const endOfMonth = (dateFormat) =>
	moment()
		.endOf('month')
		.format(dateFormat ? dateFormat : dateFormatYMD);
export const startOfLastMonth = (dateFormat) =>
	moment()
		.subtract(1, 'months')
		.startOf('month')
		.format(dateFormat ? dateFormat : dateFormatYMD);
export const endOfLastMonth = (dateFormat) =>
	moment()
		.subtract(1, 'months')
		.endOf('month')
		.format(dateFormat ? dateFormat : dateFormatYMD);
export const startOfWeek = (dateFormat) =>
	moment()
		.startOf('week')
		.format(dateFormat ? dateFormat : dateFormatYMD);
export const endOfWeek = (dateFormat) =>
	moment()
		.endOf('week')
		.format(dateFormat ? dateFormat : dateFormatYMD);
export const previousDaysFromNow = (
	prevDay: number,
	dateFormat: string = dateFormatYMD,
) => moment().subtract(prevDay, 'days').format(dateFormat);
export const beforeThirtyDays = (dateFormat): any =>
	moment()
		.subtract(30, 'days')
		.format(dateFormat ? dateFormat : dateFormatYMD);
export const start7Day = (dateFormat) =>
	moment()
		.subtract(7, 'days')
		.format(dateFormat ? dateFormat : dateFormatYMD);
export const start14Day = (dateFormat) =>
	moment()
		.subtract(14, 'days')
		.format(dateFormat ? dateFormat : dateFormatYMD);
export const start30Day = (dateFormat) =>
	moment()
		.subtract(30, 'days')
		.format(dateFormat ? dateFormat : dateFormatYMD);
export const yesterday = (dateFormat) =>
	moment()
		.subtract(1, 'days')
		.format(dateFormat ? dateFormat : dateFormatYMD);
export const tomorrow = (dateFormat) =>
	moment()
		.add(1, 'days')
		.format(dateFormat ? dateFormat : dateFormatYMD);

export const dateFromNow = (numberOfDays: number, dateFormat) =>
	moment()
		.add(numberOfDays, 'days')
		.format(dateFormat ? dateFormat : dateFormatYMD);

export const nowDate = (dateFormat) =>
	moment().format(dateFormat ? dateFormat : dateFormatYMD);
export const fromDate = (dateFormat: any) =>
	moment(
		beforeThirtyDays as moment.MomentInput,
		dateFormat ? dateFormat : dateFormatYMD,
	);
export const toDate = (dateFormat) =>
	moment(
		nowDate as moment.MomentInput,
		dateFormat ? dateFormat : dateFormatYMD,
	);

const padTo2Digits = (num) => {
	return num.toString().padStart(2, '0');
};

export const formatDate = (date) => {
	return (
		[
			date.getFullYear(),
			padTo2Digits(date.getMonth() + 1),
			padTo2Digits(date.getDate()),
		].join('-') +
		' ' +
		[
			padTo2Digits(date.getHours()),
			padTo2Digits(date.getMinutes()),
			padTo2Digits(date.getSeconds()),
		].join(':')
	);
};

export const ISO8601Formats = (timestamp: Date) =>
	moment(new Date(timestamp)).format(dateFormatYMD_hms24h);

export const formatDateYMD = (timestamp: Date) =>
	moment(new Date(timestamp)).format(dateFormatYMD);

export const formatDateYMDHM = (timestamp: Date) =>
	moment(new Date(timestamp)).format(dateFormatYMD_hm);
