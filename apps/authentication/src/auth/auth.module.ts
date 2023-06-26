import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import JwtStrategy from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
@Module({
	imports: [JwtModule.register({}), forwardRef(() => UserModule)],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtRefreshTokenStrategy, JwtStrategy],
	exports: [AuthService, LocalStrategy, JwtRefreshTokenStrategy, JwtStrategy],
})
export class AuthModule {}
