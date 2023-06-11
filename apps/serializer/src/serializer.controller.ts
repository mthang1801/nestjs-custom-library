import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { SerializerService } from './serializer.service';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class SerializerController {
	constructor(private readonly serializerService: SerializerService) {}

	@Get()
	@UsePipes(new ValidationPipe())
	findOne(): UserEntity {
		return new UserEntity({
			firstName: 'Mai',
			lastName: 'Thang',
			password: 'admin123',
			role: new RoleEntity({
				id: 1,
				name: 'Admin',
			}),
		});
	}
}
