import { MongooseDynamicModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { PostsModule } from './posts/posts.module';
import * as Joi from 'joi';

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
		MongooseDynamicModule.forRootAsync(),
		UsersModule,
		UserRolesModule,
		PostsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
