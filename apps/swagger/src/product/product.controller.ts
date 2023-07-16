import { Product } from '@app/shared/schemas/product.schema';
import {
  ApiCreatedResponseCustom,
  ApiListResponseCustom,
  ApiResponseCustom,
} from '@app/shared/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductListDto } from './dto/find-product-list.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
@ApiTags('Product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post()
	@ApiCreatedResponseCustom({
		summary: 'create product',
		type: CreateProductDto,
	})
	create(@Body() createProductDto: CreateProductDto) {
		return this.productService.create(createProductDto);
	}

	@Get()
	@ApiListResponseCustom({ summary: 'product list', type: Product })
	findAll(@Query() query: FindProductListDto) {
		return this.productService.findAll();
	}

	@Get(':id')
	@ApiResponseCustom<typeof Product>({
		type: Product,
		summary: 'product by id',
	})
	findOne(@Param('id') id: string) {
		return this.productService.findOne(+id);
	}

	@Patch(':id')
	@ApiResponseCustom<typeof Product>({
		type: Product,
		summary: 'update product by id',
	})
	update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
		return this.productService.update(+id, updateProductDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.productService.remove(+id);
	}
}
