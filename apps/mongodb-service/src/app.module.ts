import { AuthGuard } from '@app/common/modules/auth/guards/auth.guard';
import {
  AllExceptionsFilter,
  LibActionLogModule,
  LibMongoModule
} from '@app/shared';
import { LibCoreModule } from '@app/shared/core/core.module';
import { LibI18nModule } from '@app/shared/i18n';
import { TransformInterceptor } from '@app/shared/interceptors/transform.interceptor';
import { Module, ValidationPipe, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test', 'provision')
					.default('development'),
				PORT: Joi.number().port().required(),
				MONGO_URI_PRIMARY: Joi.string().required(),
				MONGO_URI_SECONDARY: Joi.string().optional(),
			}),
			validationOptions: {
				abortEarly: false,
			},
			cache: true,
			expandVariables: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
		LibI18nModule,
		LibMongoModule.forRootAsync(),
		LibCoreModule,
		AuthModule,
		UserModule,
		PostModule,
    forwardRef(() => LibActionLogModule),
	],
	controllers: [],
	providers: [
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({ transform: true, whitelist: true }),
		},
	],
})
export class AppModule {}
