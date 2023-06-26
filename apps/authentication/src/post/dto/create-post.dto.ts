import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	title: string;

	@IsOptional()
	@IsString()
	content: string;

	@IsOptional()
	@IsString()
	short_content: string;
}
