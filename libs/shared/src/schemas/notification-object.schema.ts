import { Prop } from '@nestjs/mongoose';
import SchemaCustom from '../abstract/schema-option';
import { ENUM_NOTIFICATION_OBJECT, ENUM_STATUS } from '../constants/enum';

@SchemaCustom({ _id: false, collection: 'notification-objects' })
export class NotificationObject {
	@Prop({
		type: String,
		enum: ENUM_NOTIFICATION_OBJECT,
		default: ENUM_NOTIFICATION_OBJECT.GLOBAL,
	})
	type: string;

	@Prop({ type: String, enum: ENUM_STATUS, default: ENUM_STATUS.ACTIVE })
	status: ENUM_STATUS;
}
