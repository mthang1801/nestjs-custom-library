import { Request } from 'express';
import { UserDocument } from '../schemas';

export interface IUserRequest extends Request {
	user: UserDocument;
}
