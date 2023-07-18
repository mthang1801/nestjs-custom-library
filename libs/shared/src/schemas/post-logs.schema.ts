import {
	AbstractLog,
	AbstractLogDocument,
	AbstractLogSchema,
} from '../abstract';
import SchemaCustom from '../abstract/schema-option';

@SchemaCustom({ collection: 'post_logs' })
export class PostLog extends AbstractLog {}
export type PostLogDocument = AbstractLogDocument<PostLog>;
export const PostLogSchema = AbstractLogSchema(PostLog);
