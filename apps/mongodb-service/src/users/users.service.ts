import { AbstractService } from '@app/shared';
import { ENUM_ROLES } from '@app/shared/constants/enum';
import { User, UserDocument } from '@app/shared/schemas';
import {
	BadRequestException,
	Inject,
	Injectable,
	Logger,
	forwardRef,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { PostsService } from '../posts/posts.service';
import { UserRolesService } from '../user-roles/user-roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.respository';

@Injectable()
export class UsersService extends AbstractService<UserDocument> {
	logger = new Logger(UsersService.name);
	constructor(
		private readonly userRepository: UserRepository,
		@Inject(forwardRef(() => PostsService))
		private readonly postsService: PostsService,
		@Inject(forwardRef(() => UserRolesService))
		private readonly userRoleService: UserRolesService,
	) {
		super(userRepository);
	}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const userRole = await this.userRoleService.findOne({
			name: ENUM_ROLES.USER,
		});
		console.log('Create::', userRole);
		const newUser = new User({ ...createUserDto, role: userRole });
		return await this._create(newUser);
	}

	async findAll(filter?: object) {
		return await this.userRepository.findAndCountAll(
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
		const session = await this.userRepository.startTransaction();
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
