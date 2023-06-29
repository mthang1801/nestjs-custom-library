import { MongooseDynamicModule } from '@app/shared';
import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
		MongooseDynamicModule.forRootAsync(),
		ProductModule,
		CategoryModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply().forRoutes({
			path: 'docs',
			method: RequestMethod.GET,
			version: VERSION_NEUTRAL,
		});
	}
}
