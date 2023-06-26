import { TransformInterceptor } from '@app/common/interceptors/transform.interceptor';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  SerializeOptions,
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
	@UseInterceptors(TransformInterceptor)
	@SerializeOptions({
		strategy: 'exposeAll',
	})
	findOne(): UserEntity {
		for (let i = 0; i < 10e9; i++) {}
		const user = new UserEntity({
			firstName: 'Mai',
			lastName: 'Thang',
			password: 'admin123',
			role: new RoleEntity({
				id: 1,
				name: 'Admin',
			}),
			email: 'mthang1801@gmail.com',
			phone: '0123456789',
			address: null,
		});
		return user;
	}
}
