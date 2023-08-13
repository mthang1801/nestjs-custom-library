import { AbstractService } from '@app/shared';
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

		try {
			const postResult = await this._create(
				{
					...createPostDto,
					author: await this.userService.readModel.findById(
						createPostDto.author,
						{},
						{ session },
					),
				},
				{ session },
			);

			await session.commitTransaction();
			return postResult;
		} catch (error) {
			await session.abortTransaction();
			throw new BadRequestException(error.message);
		} finally {
			await session.endSession();
		}
	}

	findAll() {
		return this.postRepository.findAndCountAll(
			{},
			{},
			{ sort: { created_at: -1 } },
		);
	}

	findOne(id: number) {
		return `This action returns a #${id} post`;
	}

	async update(id: ObjectId, updatePostDto: UpdatePostDto) {
		return this.postRepository.findOneAndUpdate({ _id: id }, updatePostDto, {
			updateOnlyOne: true,
			new: false,
		});
	}

	async updateStatus(id: ObjectId, updatePostStatusDto: UpdatePostStatusDto) {
		return this.postRepository.findByIdAndUpdate(id, updatePostStatusDto);
	}

	remove(id: ObjectId) {
		return this.postRepository.deleteById(id);
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
