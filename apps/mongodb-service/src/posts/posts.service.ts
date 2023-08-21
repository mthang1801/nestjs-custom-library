import { AbstractService } from '@app/shared';
import { ENUM_STATUS } from '@app/shared/constants/enum';
import { PostsDocument, User } from '@app/shared/schemas';
import {
	BadRequestException,
	Inject,
	Injectable,
	Logger,
	Scope,
	forwardRef,
} from '@nestjs/common';
import { ClientSession, ObjectId } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostStatusDto } from './dto/update-post-status.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable({ scope: Scope.REQUEST })
export class PostsService extends AbstractService<PostsDocument> {
	protected logger = new Logger(PostsService.name);
	constructor(
		readonly postRepository: PostsRepository,
		@Inject(forwardRef(() => UsersService))
		private readonly userService: UsersService,
	) {
		super(postRepository);
	}

	async create(createPostDto: CreatePostDto) {
		const session = await this.startSession();
		session.startTransaction();

		const author = await this.userService.readModel.findById(
			createPostDto.author,
			{},
			{ session },
		);
		try {
			const postResult = await this._create(
				{
					...createPostDto,
					author,
				},
				{ session, enableSaveAction: true },
			);

			// const postResult = await this.readModel.aggregate(
			// 	[
			// 		{
			// 			$match: {
			// 				author: toMongoObjectId(author.id),
			// 			},
			// 		},
			// 		LookupOneToOne({
			// 			from: 'users',
			// 			localField: '$author',
			// 			as: 'user',
			// 		}),
			// 	].flat(1),
			// );

			await session.commitTransaction();
			return postResult;
		} catch (error) {
			await session.abortTransaction();
			throw new BadRequestException(error.message);
		} finally {
			await session.endSession();
		}
	}

	async findAll() {
		console.log(this.postRepository);
		return this.postRepository.findOne(
			{ status: ENUM_STATUS.ACTIVE },
			{},
			{ includeSoftDelete: true },
		);
	}

	findOne(id: number) {
		console.log('Findone');
		return this._findAndCountAll(
			{ status: ENUM_STATUS.ACTIVE },
			{},
			{ includeSoftDelete: false },
		);
	}

	async update(id: ObjectId, updatePostDto: UpdatePostDto) {
		const session = await this.startSession();
		session.startTransaction();
		try {
			// await this._update({ _id: id }, updatePostDto, {
			// 	updateOnlyOne: true,
			// 	new: true,
			// 	session,
			// });
			await this._findByIdAndUpdate(id, updatePostDto, {
				new: true,
				session,
			});
			await session.commitTransaction();
		} catch (error) {
			await session.abortTransaction();
		} finally {
			await session.endSession();
		}
	}

	async updateStatus(id: ObjectId, updatePostStatusDto: UpdatePostStatusDto) {
		return this.postRepository.findOneAndUpdate(id, updatePostStatusDto);
	}

	async remove(id: ObjectId) {
		return this._deleteMany(
			{ status: ENUM_STATUS.ACTIVE },
			{ softDelete: true },
		);
	}

	async findByAuthor(id: ObjectId) {
		return this.postRepository.findAndCountAll(
			{ author: id },
			{},
			{ populate: 'author' },
		);
	}

	async deleteByAuthor(author: User, session: ClientSession) {
		try {
			await this.postRepository.deleteMany({ author }, { session });
			throw new BadRequestException('error');
		} catch (error) {
			throw new BadRequestException('error');
		}
	}
}
