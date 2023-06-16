import { MongooseDynamicModule } from '@app/common';
import { User, UserSchema } from '@app/common/schemas';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
	imports: [
		MongooseDynamicModule.forFeature({ name: User.name, schema: UserSchema }),
	],
	controllers: [UsersController],
	providers: [UsersService, UserRepository],
})
export class UsersModule {}
