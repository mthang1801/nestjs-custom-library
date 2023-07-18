import mongoose from 'mongoose';

export interface IAbstractLog {
	old_data_desc?: mongoose.Schema.Types.Mixed;
	new_data_desc?: mongoose.Schema.Types.Mixed;
	old_data?: mongoose.Schema.Types.ObjectId;
	new_data?: mongoose.Schema.Types.ObjectId;
	difference?: mongoose.Schema.Types.Mixed;
	extra_data?: mongoose.Schema.Types.Mixed;
	model_reference?: string;
	created_by?: mongoose.Schema.Types.ObjectId;
}
