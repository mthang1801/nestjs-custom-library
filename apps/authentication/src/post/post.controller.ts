import { Public } from '@app/shared/decorators/permissions.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import JwtAuthGuard from '../auth/guards/jwt.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(@Body() createPostDto: CreatePostDto) {
		return this.postService.create(createPostDto);
	}

	@Get()
	@Public()
	@UseGuards(JwtAuthGuard)
	findAll() {
		return this.postService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.postService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
		return this.postService.update(+id, updatePostDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.postService.remove(+id);
	}
}
