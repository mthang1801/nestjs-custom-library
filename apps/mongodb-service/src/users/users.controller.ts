import { MongooseClassSerialzierInterceptor } from '@app/shared';
import { MongoIdValidationPipe } from '@app/shared/pipes';
import { User } from '@app/shared/schemas';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(MongooseClassSerialzierInterceptor(User))
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get()
	@SerializeOptions({ excludePrefixes: ['first_', 'last_'] })
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':id')
	@SerializeOptions({ excludePrefixes: ['first_', 'last_'] })
	async findOne(@Param('id') id: string) {
		return await this.usersService.finById(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(+id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id', new MongoIdValidationPipe()) id: ObjectId) {
		return this.usersService.remove(id);
	}
}
