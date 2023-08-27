import { AbstractFilterQueryDto } from '@app/shared/abstract/dto/abstract-query-filter.dto';

export const generalFieldsPattern = Object.keys(new AbstractFilterQueryDto());

export const QueryFilterFieldsPatternStrategy = {
	posts: ['ratings', 'from_likes', 'to_likes'],
};

export const QueryFilterFieldsPattern = (collectionName: string) =>
	QueryFilterFieldsPatternStrategy[collectionName].concat(generalFieldsPattern);
