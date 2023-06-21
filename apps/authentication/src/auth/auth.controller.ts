import { MongooseClassSerialzierInterceptor } from '@app/common';
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
import { JwtAuthGuard } from './guards/jwt.guard';
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
		const { token, cookie } = await this.authService.getCookieToken(user);
		res.setHeader('Set-Cookie', cookie);
		res.setHeader('Authorization', token);
		res.send(user);
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	async logout(@Req() req: Request, @Res() res: Response) {
		res.setHeader('Set-Cookie', 'Authentication=;HttpOnly;Path=/;Max-Age=0');
		res.setHeader('Authorization', '');
		res.json({ message: 'Đăng xuất thành công.' });
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
