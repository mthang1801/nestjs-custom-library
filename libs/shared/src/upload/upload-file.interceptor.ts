import { Injectable, NestInterceptor, Type, mixin } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { join } from 'path';
import { UploadFileOptions } from '../types';

function UploadFileInterceptor(
	options: UploadFileOptions,
): Type<NestInterceptor> {
	@Injectable()
	class Interceptor implements NestInterceptor {
		fileInterceptor: NestInterceptor;
		constructor(configService: ConfigService) {
			const destination = join(
				process.cwd(),
				configService.get('UPLOADED_FILES_DESTINATION'),
				options.path,
			);

			const multerOptions: MulterOptions = {
				storage: diskStorage({
					destination,
					filename(req, file, callback) {
						console.log(file);
						return callback(null, file.originalname);
					},
				}),
				...options,
			};

			this.fileInterceptor = new (FileInterceptor(
				options.fieldName,
				multerOptions,
			))();
		}
		intercept(...args: Parameters<NestInterceptor['intercept']>) {
			return this.fileInterceptor.intercept(...args);
		}
	}
	return mixin(Interceptor);
}

export default UploadFileInterceptor;
