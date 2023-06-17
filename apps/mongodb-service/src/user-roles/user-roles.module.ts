import { MongooseDynamicModule } from '@app/common';
import { Module } from '@nestjs/common';
import {
  UserRole,
  UserRoleSchema,
} from '../../../../libs/common/src/schemas/user-roles.schema';
import { UserRolesController } from './user-roles.controller';
import { UserRoleRepository } from './user-roles.repository';
import { UserRolesService } from './user-roles.service';

@Module({
	imports: [
		MongooseDynamicModule.forFeatureAsync({
			name: UserRole.name,
			useFactory: () => ({ schema: UserRoleSchema }),
		}),
	],
	controllers: [UserRolesController],
	providers: [UserRolesService, UserRoleRepository],
})
export class UserRolesModule {}
