import { MongooseDynamicModule } from '@app/common';
import {
  User,
  UserRole,
  UserRoleSchema,
  UserSchema,
} from '@app/common/schemas';
import { Module } from '@nestjs/common';
import { UserRoleRepository } from 'apps/mongodb-service/src/user-roles/user-roles.repository';
import { UserRepository } from 'apps/mongodb-service/src/users/user.respository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [
		MongooseDynamicModule.forFeatureAsync({
			name: User.name,
			schema: UserSchema,
		}),
		MongooseDynamicModule.forFeatureAsync({
			name: UserRole.name,
			schema: UserRoleSchema,
		}),
	],
	controllers: [UserController],
	providers: [UserService, UserRepository, UserRoleRepository],
	exports: [UserService],
})
export class UserModule {}
