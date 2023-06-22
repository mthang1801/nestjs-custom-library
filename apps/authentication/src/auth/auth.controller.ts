import { MongooseClassSerialzierInterceptor } from '@app/common';
import { ENUM_TOKEN_TYPE } from '@app/common/constants/enum';
import { IUserRequest } from '@app/common/interfaces';
import { User } from '@app/common/schemas';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@UseInterceptors(MongooseClassSerialzierInterceptor(User))
	register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Post('login')
	@UseGuards(LocalAuthGuard)
	async login(@Req() request: IUserRequest, @Res() res: Response) {
		const { user } = request;
		const { cookieWithAccessToken, cookieWithRefreshToken } =
			await this.authService.login(user);
		request.res.setHeader('Set-Cookie', [
			cookieWithAccessToken,
			cookieWithRefreshToken,
		]);
		res.send(user);
	}

	@Post('logout')
	@UseGuards(JwtRefreshTokenGuard)
	async logout(@Req() req: IUserRequest, @Res() res: Response) {
		const { user } = req;
		await this.authService.removeRefreshToken(user);
		const getCookiesForLogout = this.authService.getCookiesForLogout();
		res.setHeader('Set-Cookie', getCookiesForLogout);

		res.json({ message: 'Đăng xuất thành công.' });
	}

	@Post('refresh')
	@UseGuards(JwtRefreshTokenGuard)
	async refresh(@Req() req: IUserRequest, @Res() res: Response) {
		const { user } = req;
		const accessTokenCookie = await this.authService.getCookieWithJwtToken(
			user.id,
			ENUM_TOKEN_TYPE.ACCESS,
		);

		res.setHeader('Set-Cookie', accessTokenCookie.cookie);
		return req.user;
	}

	@Get()
	findAll() {
		return this.authService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.authService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
		return this.authService.update(+id, updateAuthDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.authService.remove(+id);
	}
}
