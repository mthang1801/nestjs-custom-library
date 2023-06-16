import { Product } from '@app/common/schemas';
import MongooseClassSerializerInterceptor from '@app/common/utils/mongooseClassSerializer.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
// @SerializeOptions({ strategy: 'excludeAll' })
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
	@UseInterceptors(MongooseClassSerializerInterceptor(Product))
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
