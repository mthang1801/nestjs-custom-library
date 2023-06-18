import { CONNECTION_NAME, MongooseDynamicModule } from '@app/common';
import {
  Posts,
  PostsSchema,
  User,
  UserSchemaFactory,
} from '@app/common/schemas';
import { Module, forwardRef } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { PostsModule } from '../posts/posts.module';
import { UserRepository } from './user.respository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [
		MongooseDynamicModule.forFeatureAsync({
			name: User.name,
			useFactory: UserSchemaFactory,
			inject: [getModelToken(Posts.name, CONNECTION_NAME.PRIMARY)],
			imports: [
				MongooseDynamicModule.forFeature({
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
