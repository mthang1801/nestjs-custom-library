import { CreatePostDto } from '@app/common/modules/post/dto/create-post.dto';
import { PostFilterQueryDto } from '@app/common/modules/post/dto/filter-query-post.dto';
import { SaveLogDto } from '@app/common/modules/post/dto/save-log.dto';
import { UpdatePostDto } from '@app/common/modules/post/dto/update-post.dto';
import { PostService } from '@app/common/modules/post/post.service';
import { User } from '@app/shared';
import { ActionLogFilterQueryDto } from '@app/shared/action-log/dto/action-log-filter-query.dto';
import { UserAuth } from '@app/shared/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
@Controller('posts')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Get()
	async findAll(@Query() query: PostFilterQueryDto) {
		return this.postService.findAll(query);
	}

	@Get('aggregate')
	async aggregate(@Query() query: PostFilterQueryDto) {
		return this.postService.aggregate(query);
	}

	@Get('find-one')
	async findOne() {
		return this.postService.findOne();
	}

	@Get('action-logs')
	async findActionLogs(@Query() query: ActionLogFilterQueryDto) {
		return this.postService.findActionLogs(query);
	}

	@Get(':id')
	async findById(@Param('id') id: string) {
		return this.postService.findById(id);
	}

	@Post()
	async create(@Body() createPostDto: CreatePostDto) {
		return this.postService.create(createPostDto);
	}

	@Put('update-one')
	async updateOne(@Body() updatePostDto: UpdatePostDto) {
		return this.postService.updateOne(updatePostDto);
	}

	@Put('update-many')
	async updateMany(@Body() updatePostDto: UpdatePostDto) {
		return this.postService.updateMany(updatePostDto);
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
		return this.postService.update(id, updatePostDto);
	}

	@Post('save-log')
	async saveLog(@Body() payload: SaveLogDto, @UserAuth() user: User) {
		return this.postService.saveLog(payload, user);
	}

	@Delete(':id')
	async delete(@Param('id') id: string, @UserAuth() user: User) {
		return this.postService.delete(id, user);
	}
}
