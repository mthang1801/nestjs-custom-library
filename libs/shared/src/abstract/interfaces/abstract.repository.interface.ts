import { AbstractType } from '@app/shared/abstract/types/abstract.type';
import {
	Aggregate,
	ClientSession,
	FilterQuery,
	ObjectId,
	PipelineStage,
	ProjectionType,
	SaveOptions,
	UpdateQuery,
} from 'mongoose';
import { PipelineOptions } from 'stream';
export interface Write<T> {
	create(
		payload: Partial<T> | Partial<T>[],
		options?: SaveOptions & AbstractType.EnableSaveAction,
	): Promise<T | T[]>;

	update(
		fitlerQuery: FilterQuery<T>,
		payload: UpdateQuery<T>,
		options?: AbstractType.UpdateOption<T> & AbstractType.UpdateOnlyOne,
	): Promise<AbstractType.UpdateResponse>;

	findOneAndUpdate(
		filterQuery?: FilterQuery<T>,
		updateData?: UpdateQuery<T>,
		options?: AbstractType.UpdateOption<T>,
	): Promise<T>;

	findByIdAndUpdate(
		id?: string | ObjectId,
		updateData?: UpdateQuery<T>,
		options?: AbstractType.UpdateOption<T>,
	): Promise<T>;

	deleteById(
		id: ObjectId,
		options?: AbstractType.DeleteOption<T>,
	): Promise<AbstractType.UpdateResponse>;

	deleteMany(
		filterQuery?: FilterQuery<T>,
		options?: AbstractType.DeleteOption<T>,
	): Promise<AbstractType.UpdateResponse>;

	deleteOne(
		filterQuery?: FilterQuery<T>,
		options?: AbstractType.DeleteOption<T>,
	): Promise<AbstractType.UpdateResponse>;

	findOneAndDelete(
		filterQuery: FilterQuery<T>,
		options: AbstractType.DeleteOption<T>,
	): Promise<T>;

	startSession(): Promise<ClientSession>;
}

export interface Read<T> {
	findOne(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: AbstractType.FindOptions<T>,
	): Promise<T>;

	findById(
		id: string | ObjectId,
		projection?: ProjectionType<T> | string,
		options?: AbstractType.FindOptions<T>,
	): Promise<T>;

	findAll(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: AbstractType.FindOptions<T>,
	): Promise<T[]>;

	findAndCountAll(
		filterQuery?: FilterQuery<T>,
		projection?: ProjectionType<T> | string,
		options?: AbstractType.FindOptions<T>,
	): Promise<AbstractType.FindAndCountAllResponse<T>>;

	aggregateBuilder(): Aggregate<any>;
	aggregate(
		pipeline: PipelineStage[],
		options?: PipelineOptions,
	): Aggregate<Array<T>>;
}

export interface IAbstractRepository<T> extends Write<T>, Read<T> {}
