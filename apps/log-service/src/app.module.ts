import { ENUM_QUEUES, LibMongoModule, LibRabbitMQModule } from '@app/shared';
import { LibCoreModule } from '@app/shared/core/core.module';
import { Module, forwardRef } from '@nestjs/common';
import { PostsModule } from 'apps/mongodb-service/src/posts/posts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		LibCoreModule,
		LibRabbitMQModule.registerAsync({ name: ENUM_QUEUES.LOGGING_ACTION }),
		LibMongoModule.forRootAsync(),
		forwardRef(() => PostsModule),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
