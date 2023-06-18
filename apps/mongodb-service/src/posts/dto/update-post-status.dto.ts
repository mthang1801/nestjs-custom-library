import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdatePostStatusDto {
	@IsNotEmpty()
	@IsBoolean()
	status: boolean;
}
