import { Global, Module, forwardRef } from '@nestjs/common';
import { ENUM_QUEUES } from '../constants';
import { LibCoreModule } from '../core/core.module';
import { LibMongoModule } from '../mongodb';
import { LibRabbitMQModule } from '../rabbitmq';
import { ActionLog, ActionLogSchema } from '../schemas/action-log.schema';
import { LibActionLogRepository } from './action-log.repository';
import { LibActionLogService } from './action-log.service';

@Global()
@Module({
	imports: [
		forwardRef(() => LibCoreModule),
		LibRabbitMQModule.registerAsync({ name: ENUM_QUEUES.LOGGING_ACTION }),
		LibMongoModule.forFeatureAsync({
			name: ActionLog.name,
			schema: ActionLogSchema,
		}),
	],
	providers: [LibActionLogService, LibActionLogRepository],
	exports: [LibActionLogService, LibActionLogRepository],
})
export class LibActionLogModule {}
