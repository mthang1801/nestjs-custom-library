import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as Joi from 'joi';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
			validationSchema: Joi.object({
				JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
				JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),
				JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
				JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required(),
			}),
		}),
		JwtModule.register({ global: true }),
		forwardRef(() => UserModule),
		PassportModule,
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
	exports: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}
