import { LibMongoModule } from '@app/shared';
import {
  Messenger,
  MessengerSchema,
} from '@app/shared/schemas/messenger.schema';
import { Module } from '@nestjs/common';
import { MessengerController } from './messenger.controller';
import { MessengerRepository } from './messenger.repository';
import { MessengerService } from './messenger.service';

@Module({
	imports: [
		LibMongoModule.forFeatureAsync({
			name: Messenger.name,
			schema: MessengerSchema,
		}),
	],
	controllers: [MessengerController],
	providers: [MessengerService, MessengerRepository],
})
export class MessengerModule {}
