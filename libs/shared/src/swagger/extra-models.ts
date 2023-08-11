import { AuthResponseEntity } from '@app/common/modules/auth/entity/auth-response.entity';
import { User } from '../schemas';

export const extraModels = [User, AuthResponseEntity];
