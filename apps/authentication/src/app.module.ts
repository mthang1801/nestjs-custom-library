import { MongooseDynamicModule } from '@app/common';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [UserModule, MongooseDynamicModule.forRootAsync(), AuthModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
