import { User } from '@app/common/schemas';
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ClientSession, ObjectId } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostStatusDto } from './dto/update-post-status.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
	constructor(
		private readonly postRepository: PostsRepository,
		@Inject(forwardRef(() => UsersService))
		private readonly userService: UsersService,
	) {}

	async create(createPostDto: CreatePostDto) {
		const currentAuthor = await this.userService.finById(createPostDto.author);
		if (!currentAuthor) throw new BadRequestException('Author not found');
		return this.postRepository.create({
			...createPostDto,
			author: currentAuthor,
		});
	}

	findAll() {
		return this.postRepository.find({}, {}, { populate: 'author' });
	}

	findOne(id: number) {
		return `This action returns a #${id} post`;
	}

	async update(id: ObjectId, updatePostDto: UpdatePostDto) {
		return this.postRepository.findByIdAndUpdate(id, updatePostDto);
	}

	async updateStatus(id: ObjectId, updatePostStatusDto: UpdatePostStatusDto) {
		return this.postRepository.findByIdAndUpdate(id, updatePostStatusDto);
	}

	remove(id: number) {
		return `This action removes a #${id} post`;
	}

	async findByAuthor(id: ObjectId) {
		return this.postRepository.find({ author: id }, {}, { populate: 'author' });
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
