import { CoreModule } from '@app/shared/core/core.module';
import { TelegramDynamicModule } from '@app/shared/telegram/telegram.module';
import { Module } from '@nestjs/common';
import { WebsocketNamespace } from './namespace.gateway';
import { UserModule } from './user/user.module';

@Module({
	imports: [CoreModule, TelegramDynamicModule, UserModule],
	controllers: [],
	providers: [WebsocketNamespace],
})
export class WebSocketsModule {}
