import { LibAuthModule } from '@app/common/modules/auth/auth.module';
import { LibUserModule } from '@app/common/modules/user/user.module';
import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
@Module({
	imports: [LibUserModule],
	controllers: [UserController],
})
export class UserModule {}
