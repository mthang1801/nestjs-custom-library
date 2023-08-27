import { LibPostModule } from '@app/common/modules/post/post.module';
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';

@Module({
	imports: [LibPostModule],
	controllers: [PostController],
})
export class PostModule {}
