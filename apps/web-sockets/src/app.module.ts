import { LibCoreModule } from '@app/shared/core/core.module';
import { LibTelegramModule } from '@app/shared/telegram/telegram.module';
import { Module } from '@nestjs/common';
import { WebsocketNamespace } from './namespace.gateway';
import { UserModule } from './user/user.module';

@Module({
	imports: [LibCoreModule, LibTelegramModule, UserModule],
	controllers: [],
	providers: [WebsocketNamespace],
})
export class WebSocketsModule {}
