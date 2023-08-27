import { AuthGuard } from '@app/common/modules/auth/guards/auth.guard';
import { CreateUserDto } from '@app/common/modules/user/dto/create-user.dto';
import { UserService } from '@app/common/modules/user/user.service';
import { MongooseClassSerialzierInterceptor } from '@app/shared';
import { Public } from '@app/shared/decorators/permissions.decorator';
import { IUserRequest } from '@app/shared/interfaces';
import { User } from '@app/shared/schemas';
import {
  ApiCreatedResponseCustom,
  ApiResponseCustom,
} from '@app/shared/swagger';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@Controller('users')
@ApiTags('Người dùng')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@UseInterceptors(MongooseClassSerialzierInterceptor(User))
	@ApiCreatedResponseCustom({
		responseType: User,
		body: CreateUserDto,
		summary: 'Tạo người dùng',
	})
	@UseGuards(AuthGuard)
	@Public()
	async create(@Body() payload: CreateUserDto) {
		return this.userService.create(payload);
	}

	@ApiResponseCustom({
		responseType: User,
		summary: 'Lấy thông tin người dùng hiện tại',
	})
	@Get('my-info')
	async getInfo(@Req() req: IUserRequest) {
		return req.user;
	}
}
