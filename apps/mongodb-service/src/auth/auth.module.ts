import { LibAuthModule } from '@app/common/modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
	imports: [LibAuthModule],
	controllers: [AuthController],
})
export class AuthModule {}
