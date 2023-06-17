import { MongooseDynamicModule } from '@app/common';
import { User, UserSchemaFactory } from '@app/common/schemas';
import { Module } from '@nestjs/common';
import { UserRepository } from './user.respository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [
		MongooseDynamicModule.forFeatureAsync({
			name: User.name,
			useFactory: UserSchemaFactory,
		}),
	],
	controllers: [UsersController],
	providers: [UsersService, UserRepository],
})
export class UsersModule {}
