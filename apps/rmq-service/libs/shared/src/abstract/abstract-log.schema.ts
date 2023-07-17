import mongoose, { Schema } from 'mongoose';
import { IAbstractLog } from './interfaces/abstract-log.interface';

const AbstractLogSchema = (modelName: string) =>
	new Schema<IAbstractLog>(
		{
			old_data_desc: { type: mongoose.Schema.Types.Mixed, default: null },
			new_data_desc: { type: mongoose.Schema.Types.Mixed, default: null },
			difference: { type: mongoose.Schema.Types.Mixed },
			old_data: { type: mongoose.Schema.Types.ObjectId },
			new_data: { type: mongoose.Schema.Types.ObjectId },
			extra_data: { type: mongoose.Schema.Types.Mixed },
			model_reference: { type: String },
			created_by: { type: mongoose.Schema.Types.Mixed },
		},
		{
			timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
			strict: false,
			collection: modelName,
			strictQuery: false,
		},
	);

const AbstractLogModel = (modelName: string) =>
	mongoose.model(modelName, AbstractLogSchema(modelName));

export default AbstractLogModel;
