import { Module, forwardRef } from '@nestjs/common';
import { InventoryModule } from '../inventory/inventory.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
	imports: [forwardRef(() => InventoryModule)],
	controllers: [ProductController],
	providers: [ProductService],
})
export class ProductModule {}
