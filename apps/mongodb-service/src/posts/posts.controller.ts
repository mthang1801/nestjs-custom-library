import { MongoIdValidationPipe } from '@app/common/pipes';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostStatusDto } from './dto/update-post-status.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Post()
	create(@Body() createPostDto: CreatePostDto) {
		return this.postsService.create(createPostDto);
	}

	@Get()
	findAll() {
		return this.postsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.postsService.findOne(+id);
	}

	@Put(':id')
	update(
		@Param('id', new MongoIdValidationPipe()) id: ObjectId,
		@Body() updatePostDto: UpdatePostDto,
	) {
		return this.postsService.update(id, updatePostDto);
	}

	@Patch(':id')
	udpateStatus(
		@Param('id', new MongoIdValidationPipe()) id: ObjectId,
		@Body() updatePostStatusDto: UpdatePostStatusDto,
	) {
		return this.postsService.updateStatus(id, updatePostStatusDto);
	}

	@Delete(':id')
	remove(@Param('id', new MongoIdValidationPipe()) id: ObjectId) {
		return this.postsService.remove(id);
	}

	@Get('author/:id')
	async findByAuthor(@Param('id', new MongoIdValidationPipe()) id: ObjectId) {
		return this.postsService.findByAuthor(id);
	}
}
