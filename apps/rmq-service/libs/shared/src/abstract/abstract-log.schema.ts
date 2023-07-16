import mongoose, { Schema } from 'mongoose';

const AbstractLogSchema = new Schema(
	{
		old_data_desc: { type: mongoose.Schema.Types.Mixed, default: null },
		new_data_desc: { type: mongoose.Schema.Types.Mixed, default: null },
		difference: { type: mongoose.Schema.Types.Mixed },
		old_data: { type: mongoose.Schema.Types.ObjectId },
		new_data: { type: mongoose.Schema.Types.ObjectId },
		extra_data: { type: mongoose.Schema.Types.Mixed },
	},
	{ timestamps: true, strict: false },
);

const AbstractLogModel = (modelName: string) =>
	mongoose.model(modelName, AbstractLogSchema);

export default AbstractLogModel;
