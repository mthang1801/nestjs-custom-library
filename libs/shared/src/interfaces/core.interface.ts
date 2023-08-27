import { Request } from 'express';
import { User } from '../schemas';

export interface IUserRequest extends Request {
	user: User;
}
