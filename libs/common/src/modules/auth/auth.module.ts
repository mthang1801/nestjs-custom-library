import { ENUM_QUEUES, LibMongoModule, LibRabbitMQModule } from '@app/shared';
import { LibCoreModule } from '@app/shared/core/core.module';
import { Global, Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LibUserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Global()
@Module({
	imports: [
		LibCoreModule,
		LibMongoModule,
		forwardRef(() => LibUserModule),
		LibRabbitMQModule.registerAsync({ name: ENUM_QUEUES.MAIL_SERVICE }),
		JwtModule.register({}),
	],
	providers: [AuthService, LocalStrategy],
	exports: [AuthService, LocalStrategy, JwtModule],
})
export class LibAuthModule {}
