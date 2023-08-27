import { AuthService } from '@app/common/modules/auth/auth.service';
import { LoginDto } from '@app/common/modules/auth/dto/login.dto';
import { SetPasswordDto } from '@app/common/modules/auth/dto/update-password.dto';
import { AuthResponseEntity } from '@app/common/modules/auth/entity/auth-response.entity';
import { LocalAuthGuard } from '@app/common/modules/auth/guards/local.guard';
import { Public } from '@app/shared/decorators/permissions.decorator';
import { IUserRequest } from '@app/shared/interfaces';
import { ApiResponseCustom } from '@app/shared/swagger';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@Post('login')
	@UseGuards(LocalAuthGuard)
	@Public()
	@ApiResponseCustom({
		body: LoginDto,
		responseType: AuthResponseEntity,
		summary: 'Đăng nhập TK bằng email hoặc phone',
	})
	async login(@Req() req: IUserRequest): Promise<AuthResponseEntity> {
		const { user } = req;
		return await this.authService.generateTokenPair(user);
	}

	@Post('set-password')
	@Public()
	@ApiResponseCustom({
		body: SetPasswordDto,
		summary: 'Set mật khẩu',
		httpCode: 200,
	})
	async setPassword(
		@Body() payload: SetPasswordDto,
		@Req() request: IUserRequest,
	) {
		await this.authService.setPassword(payload);
	}
}
