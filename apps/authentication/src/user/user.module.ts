import { MongooseDynamicModule } from '@app/common';
import { User, UserSchema } from '@app/common/schemas';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
	imports: [
		MongooseDynamicModule.forFeatureAsync({
			name: User.name,
			schema: UserSchema,
		}),
	],
	controllers: [UserController],
	providers: [UserService, UserRepository],
	exports: [UserService, UserRepository],
})
export class UserModule {}
