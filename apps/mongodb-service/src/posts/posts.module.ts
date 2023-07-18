import { MongooseDynamicModule } from '@app/shared';
import { Posts, PostsSchema, PostsSchemaFactory } from '@app/shared/schemas';
import { PostLog, PostLogSchema } from '@app/shared/schemas/post-logs.schema';
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
		// Model post_logs which save action history in posts model
		MongooseDynamicModule.forFeatureAsync({
			name: PostLog.name,
			schema: PostLogSchema,
		}),
		forwardRef(() => UsersModule),
	],
	controllers: [PostsController],
	providers: [PostsService, PostsRepository],
	exports: [PostsService, PostsRepository],
})
export class PostsModule {}
