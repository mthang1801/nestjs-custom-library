import { User } from '@app/shared/schemas';
import {
    BadRequestException,
    Inject,
    Injectable,
    forwardRef,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { PostsService } from '../posts/posts.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.respository';

@Injectable()
export class UsersService {
	constructor(
		private readonly userRepository: UserRepository,
		@Inject(forwardRef(() => PostsService))
		private readonly postsService: PostsService,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const createUser = await this.userRepository.create(createUserDto);
		return createUser;
	}

	async findAll(filter?: object) {
		return await this.userRepository.find(
			{},
			{},
			{ skip: 0, limit: 4, populate: ['role'] },
		);
	}

	async finById(id: string) {
		const result = await this.userRepository.findById(
			id,
			{},
			{ populate: { path: 'posts' } },
		);
		return result;
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	async remove(id: ObjectId) {
		const session = await this.userRepository.connection.startSession();
		session.startTransaction();
		try {
			const deletedUser = await this.userRepository.findOneAndDelete(
				{
					_id: id,
				},
				{ session },
				{ permanently: true },
			);
			await this.postsService.deleteByAuthor(deletedUser, session);
			await session.commitTransaction();
		} catch (error) {
			await session.abortTransaction();
			throw new BadRequestException(error.message);
		} finally {
			await session.endSession();
		}
	}
}
