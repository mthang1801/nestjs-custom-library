import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as Joi from 'joi';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
			validationSchema: Joi.object({
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION_TIME: Joi.number().required(),
			}),
		}),
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: `${configService.get<number>('JWT_EXPIRATION_TIME')}s`,
				},
			}),
			inject: [ConfigService],
		}),
		forwardRef(() => UserModule),
		PassportModule,
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
