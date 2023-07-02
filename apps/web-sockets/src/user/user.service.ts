import { Injectable } from '@nestjs/common';
import { UserGateway } from './user.gateway';
@Injectable()
export class UserService {
	constructor(private readonly userGateway: UserGateway) {}
	async create(payload: any): Promise<any> {
		console.log('UserService::', payload);
		await this.userGateway.create(payload);
	}
}
