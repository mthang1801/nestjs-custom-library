import { LibMongoModule, PostsSchema } from '@app/shared';
import { Module, Post, forwardRef } from '@nestjs/common';
import { LibUserModule } from '../user/user.module';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
	imports: [
		forwardRef(() => LibUserModule),
		LibMongoModule.forFeatureAsync({ name: Post.name, schema: PostsSchema }),
	],
	providers: [PostService, PostRepository],
	exports: [PostService, PostRepository],
})
export class LibPostModule {}
