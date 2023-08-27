import { LibMongoModule } from '@app/shared';
import { LibMailModule } from '@app/shared/mail/mail.module';
import { User, UserSchema, UserSchemaFactory } from '@app/shared/schemas';

import { Global, Module, forwardRef } from '@nestjs/common';
import { LibAuthModule } from '../auth/auth.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
@Global()
@Module({
	imports: [
		LibMailModule,
		forwardRef(() => LibAuthModule),
		LibMongoModule.forFeatureAsync({
			name: User.name,
			schema: UserSchema,
			useFactory: UserSchemaFactory,
		}),
	],
	providers: [UserService, UserRepository],
	exports: [UserService, UserRepository],
})
export class LibUserModule {}
