export const valueToBoolean = (value: any) => {
	if ([true, 'true', 1, '1', 'yes', 'y'].includes(value?.toLowerCase()))
		return true;
	if ([false, 'false', 0, '0', 'no', 'n'].includes(value?.toLowerCase()))
		return false;
	return undefined;
};
