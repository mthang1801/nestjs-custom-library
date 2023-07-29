import { AbstractService } from '@app/shared';
import { PostsDocument, User } from '@app/shared/schemas';
import {
  BadRequestException,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  Scope,
  forwardRef,
} from '@nestjs/common';
import { CONTEXT } from '@nestjs/microservices';
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
		private readonly postRepository: PostsRepository,
		@Inject(forwardRef(() => UsersService))
		private readonly userService: UsersService,
		@Inject(CONTEXT) private readonly context: ExecutionContext,
	) {
		super(postRepository);
	}

	async create(createPostDto: CreatePostDto) {
		const currentAuthor = await this.userService.finById(createPostDto.author);
		if (!currentAuthor) throw new BadRequestException('Author not found');
		return this._create({
			...createPostDto,
			author: currentAuthor,
		});
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
