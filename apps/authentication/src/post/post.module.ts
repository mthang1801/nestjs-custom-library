import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
	imports: [AuthModule, forwardRef(() => UserModule)],
	controllers: [PostController],
	providers: [PostService],
})
export class PostModule {}
