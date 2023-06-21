import { MongooseClassSerialzierInterceptor } from '@app/common';
import { MongoIdValidationPipe } from '@app/common/pipes';
import { User } from '@app/common/schemas';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ObjectId } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseInterceptors(MongooseClassSerialzierInterceptor(User))
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	async create(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.userService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', new MongoIdValidationPipe()) id: ObjectId) {
		return this.userService.findById(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(+id);
	}
}
