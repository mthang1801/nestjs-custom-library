import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { ENUM_UNIT_TIMESTAMP, ENUM_WEEK_DAY } from '../constants/enum';
import { DataType, GenerateRandomCode, UnitTimestamp, Weekday } from '../types';
@Injectable()
export class UtilService {
	logger = new Logger(UtilService.name);

	/**
	 * generate random integer number
	 * @param {Number} numDigits
	 * @returns {Number}
	 */
	generateRandomNumber = (numDigits = 6) =>
		Math.floor(
			Number(`10e${numDigits - 2}`) +
				Math.random() * 9 * Number(`10e${numDigits - 2}`),
		);

	/**
	 * Reference : https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
	 * Generate number from string
	 * cyrb53, a simple but high quality 53-bit hash. It's quite fast, provides very good* hash distribution,
	 * and because it outputs 53 bits, has significantly lower collision rates compared to any 32-bit hash.
	 * Also, you can ignore SA's CC license as it's https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
	 * @param {string} str
	 * @param {number} seed
	 * @returns {string}
	 */
	cyrb53(str: string, seed = 0) {
		let h1 = 0xdeadbeef ^ seed,
			h2 = 0x41c6ce57 ^ seed;
		for (let i = 0, ch; i < str.length; i++) {
			ch = str.charCodeAt(i);
			h1 = Math.imul(h1 ^ ch, 2654435761);
			h2 = Math.imul(h2 ^ ch, 1597334677);
		}
		h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
		h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
		h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
		h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

		return 4294967296 * (2097151 & h2) + (h1 >>> 0);
	}

	/**
	 * Calculate a 32 bit FNV-1a hash
	 * Found here: https://gist.github.com/vaiorabbit/5657561
	 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
	 *
	 * @param {string} str the input value
	 * @param {integer} [seed] optionally pass the hash of the previous chunk
	 * @param {boolean} [asString=false] set to true to return the hash value as
	 * 8-digit hex string instead of an integer
	 * @returns { string}
	 */
	hashFnv32a(str: string, seed = 0x811c9dc5, asString = true) {
		/*jshint bitwise:false */
		let i, l;
		let hval = seed;

		for (i = 0, l = str.length; i < l; i++) {
			hval ^= str.charCodeAt(i);
			hval +=
				(hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
		}
		if (asString) {
			// Convert to 8 digit hex string
			return ('0000000' + (hval >>> 0).toString(16)).substr(-8);
		}

		return hval >>> 0;
	}

	/**
	 * Generate random code with suffix, prefix
	 * @param {object} param
	 * @returns {string}
	 */
	generateRandomCode({
		str,
		prefix,
		suffix,
		algorithm = 'hashFnv32a',
	}: GenerateRandomCode) {
		return [prefix, this[algorithm](str), suffix].filter(Boolean).join('_');
	}

	/**
	 * Get week day
	 * @param {Date} date
	 * @param {string} startWeekDay
	 * @returns {number}
	 */
	getWeekOfMonth(date: Date = new Date(), startWeekDay: Weekday = 'MONDAY') {
		const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
		const firstDay = firstDate.getDay();

		let weekNumber = Math.ceil((date.getDate() + firstDay) / 7);
		if (startWeekDay === ENUM_WEEK_DAY.MONDAY) {
			if (date.getDay() === 0 && date.getDate() > 1) {
				weekNumber -= 1;
			}
			if (firstDate.getDate() === 1 && firstDay === 0 && date.getDate() > 1) {
				weekNumber += 1;
			}
		}
		return weekNumber;
	}

	/**
	 *  get  Day of week
	 * @param {Date} date
	 * @returns {ENUM_WEEK_DAY}
	 */
	getDayOfWeek(date: Date = new Date()) {
		return Object.values(ENUM_WEEK_DAY)[date.getDay()];
	}

	/**
	 * @return {Date[]} List with date objects for each day of the month
	 * @param month
	 * @param year
	 */
	getDaysInMonth(month: number, year: number) {
		const date = new Date(year, month - 1, 1);
		const days = [];
		while (date.getMonth() === month - 1) {
			days.push(new Date(date));
			date.setDate(date.getDate() + 1);
		}
		return days;
	}

	/**
	 * Get duration between 2 different time
	 * @param {Date} start
	 * @param {Date} end
	 * @param {string} unitTimestamp
	 * @returns {number}
	 */
	getDifferentTimestamp(
		start: Date,
		end: Date,
		unitTimestamp: UnitTimestamp = 'MILISECCONDS',
	) {
		const startTime = moment(start);
		const endTime = moment(end);
		const duration = moment.duration(endTime.diff(startTime));

		const durationStrategy = {
			[ENUM_UNIT_TIMESTAMP.MILISECCONDS]: duration.asMilliseconds(),
			[ENUM_UNIT_TIMESTAMP.SECONDS]: duration.asSeconds(),
			[ENUM_UNIT_TIMESTAMP.MINUTES]: duration.asMinutes(),
			[ENUM_UNIT_TIMESTAMP.HOURS]: duration.asHours(),
			[ENUM_UNIT_TIMESTAMP.DAYS]: duration.asDays(),
			[ENUM_UNIT_TIMESTAMP.WEEKS]: duration.asWeeks(),
			[ENUM_UNIT_TIMESTAMP.MONTHS]: duration.asMonths(),
			[ENUM_UNIT_TIMESTAMP.YEARS]: duration.asYears(),
		};

		return Math.abs(durationStrategy[unitTimestamp]);
	}

	/**
	 * Get week of year
	 * @param {Date} date
	 * @returns {number}
	 */
	getWeekInYear(date: Date = new Date()) {
		return moment(date).week();
	}

	/**
	 * Get type of value data
	 * @param {any} value
	 * @returns
	 */
	typeOf(value: any): DataType {
		return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
	}

	/**
	 * Format number as currency
	 * @param number
	 * @param suffix
	 * @param signal
	 * @param locale
	 * @returns
	 */
	formatNumberAsCurrency(
		number: number,
		suffix = '',
		signal = ',',
		locale = 'vn-VI',
	) {
		return this.typeOf(number) === 'number'
			? `${Intl.NumberFormat(locale).format(number).toString()}${suffix}`
					.trim()
					.replace(/,/g, signal)
			: `${String(number)}${suffix}`;
	}

	valueToBoolean(value: any) {
		if (value === null || value === undefined) {
			return undefined;
		}
		if (this.typeOf(value) === 'boolean') {
			return value;
		}
		if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
			return true;
		}
		if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
			return false;
		}
		return undefined;
	}

	distance = (lat1, lon1, lat2, lon2, unit) => {
		const radlat1 = (Math.PI * lat1) / 180;
		const radlat2 = (Math.PI * lat2) / 180;
		const theta = lon1 - lon2;
		const radtheta = (Math.PI * theta) / 180;
		let dist =
			Math.sin(radlat1) * Math.sin(radlat2) +
			Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = (dist * 180) / Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit == 'K') {
			dist = dist * 1.609344;
		}
		if (unit == 'N') {
			dist = dist * 0.8684;
		}
		return dist;
	};

	removeVietnameseTones(str: string) {
		str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
		str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
		str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
		str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
		str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
		str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
		str = str.replace(/đ/g, 'd');
		str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
		str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
		str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
		str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
		str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
		str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
		str = str.replace(/Đ/g, 'D');
		// Some system encode vietnamese combining accent as individual utf-8 characters
		// Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
		str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
		str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
		// Remove extra spaces
		// Bỏ các khoảng trắng liền nhau
		str = str.replace(/ + /g, ' ');
		str = str.trim();
		// Remove punctuations
		// Bỏ dấu câu, kí tự đặc biệt
		str = str.replace(
			/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
			' ',
		);
		return str.toLowerCase();
	}

	validateEmail(email: string) {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			);
	}

	isJsonString(str: string) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	mergeArray(initArr: any[], insertedArr: any[], index: number) {
		const _initArr = [...initArr];
		return [
			...initArr.slice(0, index),
			...insertedArr,
			..._initArr.slice(index, initArr.length),
		];
	}

	// const arrLike = { 0: 'foo', 1: 'bar', 2: 'baz', length: 3 };
	/**
	 * return : [ 'foo', 'bar', 'baz' ]
	 * @param {object} obj
	 * @returns {string[]}
	 */
	convertObjectLikeArray(obj) {
		return Array.from(obj);
	}

	/**
	 * Masking characters
	 * @param {string} str
	 * @param {number} showNumberLastChars
	 * @returns {strring}
	 */
	maskedCharacters(
		str: string,
		showNumberLastChars: number = Math.ceil(str.length * 0.5),
	) {
		const lastNumberOfCharacters = str.slice(-showNumberLastChars);
		const maskedCharacter = lastNumberOfCharacters.padStart(str.length, '*');
		return maskedCharacter;
	}
}
