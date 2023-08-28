import { Global, Module, forwardRef } from '@nestjs/common';
import { LibCoreModule } from '../core/core.module';
import { LibMongoModule } from '../mongodb';
import { ENUM_QUEUES, LibRabbitMQModule } from '../rabbitmq';
import { ActionLog, ActionLogSchema } from '../schemas/action-log.schema';
import { ActionLogController } from './action-log.controller';
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
	controllers: [ActionLogController],
	providers: [LibActionLogService, LibActionLogRepository],
	exports: [LibActionLogService, LibActionLogRepository],
})
export class LibActionLogModule {}
