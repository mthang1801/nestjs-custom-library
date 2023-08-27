import { AbstractService, Posts, PostsDocument, User } from '@app/shared';
import { AbstractType } from '@app/shared/abstract/types/abstract.type';
import { ActionLogQueryFilterDto } from '@app/shared/action-log/dto/action-log-query-filter.dto';
import { ENUM_STATUS } from '@app/shared/constants/enum';
import * as postData from '@app/shared/data/post.json';
import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostFilterQueryDto } from './dto/filter-query-post.dto';
import { SaveLogDto } from './dto/save-log.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
@Injectable()
export class PostService extends AbstractService<PostsDocument> {
	logger = new Logger(PostService.name);
	constructor(private readonly postRepository: PostRepository) {
		super(postRepository);
	}

	async findAll({ QuerySearchFilter }: PostFilterQueryDto) {
		return this._findAndCountAll(QuerySearchFilter, {
			includeSoftDelete: false,
		});
	}

	async aggregate({
		AggregateQueryFilter,
		AggregateQuerySearch,
		FacetResponseResultAndMetadata,
	}: PostFilterQueryDto) {
		const [{ data, metadata }] = await this._aggregate<
			AbstractType.ResponseDataAndMetadata<Posts>
		>(
			[
				AggregateQueryFilter,
				AggregateQuerySearch,
				FacetResponseResultAndMetadata,
			]
				.filter(Boolean)
				.flat(1),
		);

		return { data, metadata };
	}

	async findById(id: string) {
		return this._findById(id);
	}

	async findOne() {
		return this._findOne(
			{ created_by_user: '64e76ac46b1069c2d70d7eeb' },
			['title', 'status', 'content', 'short_content'],
			{ includeSoftDelete: true },
		);
	}

	async findActionLogs(query: ActionLogQueryFilterDto) {
		return this._findActionLogs(query);
	}

	async create(createPostDto: CreatePostDto) {
		for (let i = 0; i <= Math.ceil(postData.length / 100); i++) {
			await this._create(postData.slice(i * 100, (i + 1) * 100) as any[]);
		}
	}

	saveLog(saveLogDto: SaveLogDto, user: User) {
		this._saveIntoLog({
			...saveLogDto,
			created_by_user: user.id,
		});
	}

	async update(id: string, updatePostDto: UpdatePostDto) {
		return await this._update({ _id: id }, updatePostDto);
	}

	async updateOne(updatePostDto: UpdatePostDto) {
		const session = await this.startSession();
		session.startTransaction();
		try {
			await this._update(
				{ status: ENUM_STATUS.ACTIVE },
				{ ...updatePostDto, status: ENUM_STATUS.INACTIVE },
				{ updateOnlyOne: true, session },
			);

			const result = await this._findOneAndUpdate(
				{ status: ENUM_STATUS.INACTIVE },
				{ ...updatePostDto, status: ENUM_STATUS.ACTIVE },
				{
					session,
				},
			);

			await this._findByIdAndUpdate(
				result.id,
				{
					...result,
					status: ENUM_STATUS.INACTIVE,
				},
				{ session },
			);

			await this._update(
				{ status: ENUM_STATUS.INACTIVE },
				{ ...updatePostDto, status: ENUM_STATUS.ACTIVE },
				{ updateOnlyOne: true, session },
			);

			await session.commitTransaction();
		} catch (error) {
			await session.abortTransaction();
		} finally {
			await session.endSession();
		}
	}

	async updateMany(updatePostDto) {
		await this._update(
			{ status: ENUM_STATUS.ACTIVE },
			{ ...updatePostDto, status: ENUM_STATUS.INACTIVE },
		);
		await this._update(
			{ status: ENUM_STATUS.INACTIVE },
			{ ...updatePostDto, status: ENUM_STATUS.ACTIVE },
		);
	}

	async delete(id: string, user: User) {
		return await this._deleteMany(
			{ status: 'INACTIVE' },
			{ deleted_by_user: user.id },
		);
	}
}
