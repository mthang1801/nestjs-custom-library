import * as Client from '@jsreport/nodejs-client';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule implements OnModuleInit {
	private client: Client;
	onModuleInit() {
		this.client = Client({
			serverUrl: 'http://localhost:5488',
			username: 'admin',
			password: 'admin123',
		});
	}
}
