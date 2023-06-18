import { MongooseDynamicModule } from '@app/common';
import { Posts, PostsSchema, PostsSchemaFactory } from '@app/common/schemas';
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
})
export class PostsModule {}
