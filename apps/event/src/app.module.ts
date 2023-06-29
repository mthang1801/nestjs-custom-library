import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { InventoryModule } from './inventory/inventory.module';
import { ProductModule } from './product/product.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
		EventEmitterModule.forRoot(),
		ProductModule,
		InventoryModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
