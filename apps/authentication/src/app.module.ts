import { MongooseDynamicModule } from '@app/common';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		UserModule,
		MongooseDynamicModule.forRootAsync(),
		AuthModule,
		PostModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(cookieParser()).forRoutes('*');
	}
}
