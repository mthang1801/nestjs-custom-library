import { MongooseDynamicModule } from '@app/common';
import { Posts, PostsSchema } from '@app/common/schemas';
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

@Module({
	imports: [
		MongooseDynamicModule.forFeatureAsync({
			name: Posts.name,
			useFactory: () => ({ schema: PostsSchema }),
		}),
	],
	controllers: [PostsController],
	providers: [PostsService, PostsRepository],
})
export class PostsModule {}
