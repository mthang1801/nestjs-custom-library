import mongoose from 'mongoose';

export interface IAbstractLog {
	old_data_desc?: any;
	new_data_desc?: any;
	old_data?: mongoose.Schema.Types.ObjectId;
	new_data?: mongoose.Schema.Types.ObjectId;
	difference?: any;
	extra_data?: any;
	context?: any;
	model_reference?: string;
	created_by?: mongoose.Schema.Types.ObjectId | string | any;
	updated_by?: mongoose.Schema.Types.ObjectId | string | any;
}
