import { IsOptional } from 'class-validator';

export class UpdateUser {
	@IsOptional()
	fullname: string;

	@IsOptional()
	dob: Date;
}
