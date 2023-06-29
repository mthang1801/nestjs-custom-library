import { debounce } from './function.utils';
import {
	compareHashedString,
	getPageSkipLimit,
	hashedString,
	recursivelyStripNullValues,
	typeOf,
	valueToBoolean,
} from './function.utils';

const utils = {
	valueToBoolean,
	typeOf,
	getPageSkipLimit,
	recursivelyStripNullValues,
	hashedString,
	compareHashedString,
	debounce,
};

export default utils;
