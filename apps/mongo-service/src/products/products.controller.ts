import MongooseClassSerializerInterceptor from '@app/common/mongoose/interceptors/mongooseClassSerializer.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors
} from '@nestjs/common';
import { Product } from '../../../../libs/common/src/schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
// @UseInterceptors(MongooseClassSerializerInterceptor(Product))
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	create(@Body() createProductDto: CreateProductDto) {
		return this.productsService.create(createProductDto);
	}

	@Get()
	findAll(@Query() query: FindProductDto) {
		console.log(query);
		return this.productsService.findAll(query);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.productsService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
		return this.productsService.update(id, updateProductDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.productsService.remove(+id);
	}
}
