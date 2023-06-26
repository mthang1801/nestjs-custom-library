import { SetMetadata } from '@nestjs/common';
import { PERMISSION } from '../constants/enum';
export const Public = () => SetMetadata(PERMISSION.IS_PUBLIC_KEY, true);
