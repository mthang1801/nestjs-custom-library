import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
		UserModule,
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
