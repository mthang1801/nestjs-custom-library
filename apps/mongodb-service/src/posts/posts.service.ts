import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
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
		return `This action returns all posts`;
	}

	findOne(id: number) {
		return `This action returns a #${id} post`;
	}

	update(id: number, updatePostDto: UpdatePostDto) {
		return `This action updates a #${id} post`;
	}

	remove(id: number) {
		return `This action removes a #${id} post`;
	}

	async findByAuthor(id: ObjectId) {
		return this.postRepository.find({ author: id }, {}, { populate: 'author' });
	}
}
