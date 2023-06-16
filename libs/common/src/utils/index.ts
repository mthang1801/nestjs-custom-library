import {
  getPageSkipLimit,
  recursivelyStripNullValues,
  typeOf,
  valueToBoolean,
} from './function.utils';
export * from './mongooseClassSerializer.interceptor';

const utils = {
	valueToBoolean,
	typeOf,
	getPageSkipLimit,
	recursivelyStripNullValues,
};

export default utils;
