import { AllExceptionsFilter, MongooseDynamicModule } from '@app/shared';
import { LibCoreModule } from '@app/shared/core/core.module';
import { TransformInterceptor } from '@app/shared/interceptors/transform.interceptor';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import * as Joi from 'joi';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { UsersModule } from './users/users.module';

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
		LibCoreModule,
		MongooseDynamicModule.forRootAsync(),
		UsersModule,
		UserRolesModule,
		CategoriesModule,
		PostsModule,
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
	],
})
export class AppModule {}
