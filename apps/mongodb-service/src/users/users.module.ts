import { CONNECTION_NAME, LibMongoModule } from '@app/shared';
import {
  Posts,
  PostsSchema,
  User,
  UserSchemaFactory,
} from '@app/shared/schemas';
import { Module, forwardRef } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { PostsModule } from '../posts/posts.module';
import { UserRolesModule } from '../user-roles/user-roles.module';
import { UserRepository } from './user.respository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [
		forwardRef(() => UserRolesModule),
		LibMongoModule.forFeatureAsync({
			name: User.name,
			useFactory: UserSchemaFactory,
			inject: [getModelToken(Posts.name, CONNECTION_NAME.PRIMARY)],
			imports: [
				LibMongoModule.forFeature({
					name: Posts.name,
					schema: PostsSchema,
					connectionName: CONNECTION_NAME.PRIMARY,
				}),
			],
		}),
		forwardRef(() => PostsModule),
	],
	controllers: [UsersController],
	providers: [UsersService, UserRepository],
	exports: [UsersService, UserRepository],
})
export class UsersModule {}
