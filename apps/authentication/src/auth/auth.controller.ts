import { MongooseClassSerialzierInterceptor } from '@app/shared';
import { ENUM_TOKEN_TYPE } from '@app/shared/constants/enum';
import { IUserRequest } from '@app/shared/interfaces';
import { User } from '@app/shared/schemas';
import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtRefreshTokenAuthGuard } from './guards/jwt-refersh-token.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@Post('register')
	@UseInterceptors(MongooseClassSerialzierInterceptor(User))
	async register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Post('login')
	@UseGuards(LocalAuthGuard)
	async login(@Req() req: IUserRequest, @Res() res: Response) {
		const { user } = req;
		await this.authService.generateAndSaveToken(user, res);
		res.json(user);
	}

	@Post('refresh')
	@UseGuards(JwtRefreshTokenAuthGuard)
	async refresh(@Req() req: IUserRequest, @Res() res: Response) {
		const { user } = req;
		const { cookie: accessCookie } = await this.authService.getCookieWithToken(
			user,
			ENUM_TOKEN_TYPE.ACCESS,
		);
		res.setHeader('Set-Cookie', accessCookie);
		res.json(user);
	}

	@Post('logout')
	@UseGuards(JwtRefreshTokenAuthGuard)
	async logout(@Req() req: IUserRequest, @Res() res: Response) {
		const { user } = req;
		const cookie = await this.authService.getCookieForLogout(user);
		res.setHeader('Set-Cookie', cookie);
		res.status(200).json({ message: 'Logout success' });
	}
}
