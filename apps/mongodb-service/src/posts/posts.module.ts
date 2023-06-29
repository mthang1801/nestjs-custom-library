import { MongooseDynamicModule } from '@app/shared';
import { Posts, PostsSchema, PostsSchemaFactory } from '@app/shared/schemas';
import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

@Module({
	imports: [
		MongooseDynamicModule.forFeatureAsync({
			name: Posts.name,
			schema: PostsSchema,
			useFactory: PostsSchemaFactory,
		}),
		forwardRef(() => UsersModule),
	],
	controllers: [PostsController],
	providers: [PostsService, PostsRepository],
	exports: [PostsService, PostsRepository],
})
export class PostsModule {}
