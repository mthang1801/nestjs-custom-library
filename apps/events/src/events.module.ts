import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ProductsModule } from './products/products.module';

@Module({
	imports: [
		EventEmitterModule.forRoot({
			wildcard: true,
			delimiter: '.',
			newListener: true,
			removeListener: true,
			maxListeners: 100,
			verboseMemoryLeak: false,
			ignoreErrors: false,
		}),
		ProductsModule,
	],
	controllers: [EventsController],
	providers: [EventsService],
})
export class EventsModule {}
