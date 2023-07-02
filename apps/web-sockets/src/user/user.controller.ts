import { Body, Controller, Post } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	async create(@Body() payload: any) {
		console.log('UserController::', payload);
		this.userService.create(payload);
	}
}
