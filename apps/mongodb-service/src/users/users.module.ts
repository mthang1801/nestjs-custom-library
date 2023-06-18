import { CONNECTION_NAME, MongooseDynamicModule } from '@app/common';
import {
  Posts,
  PostsSchema,
  User,
  UserSchemaFactory,
} from '@app/common/schemas';
import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
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
				MongooseModule.forFeature(
					[{ name: Posts.name, schema: PostsSchema }],
					CONNECTION_NAME.PRIMARY,
				),
			],
		}),
	],
	controllers: [UsersController],
	providers: [UsersService, UserRepository],
	exports: [UsersService, UserRepository],
})
export class UsersModule {}
