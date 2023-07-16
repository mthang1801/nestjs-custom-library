import { MongooseDynamicModule } from '@app/shared';
import { UserRole, UserRoleSchema } from '@app/shared/schemas';
import { Module } from '@nestjs/common';
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
	exports: [UserRolesService, UserRoleRepository],
})
export class UserRolesModule {}
