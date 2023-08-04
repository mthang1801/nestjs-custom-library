import { Injectable, NestInterceptor, Type, mixin } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Observable } from 'rxjs';
import { UploadFilesOptions } from '../types';

function UploadFilesInterceptor(
	options: UploadFilesOptions,
): Type<NestInterceptor> {
	@Injectable()
	class Interceptor implements NestInterceptor {
		fileInterceptors: NestInterceptor;
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
						return callback(null, file.originalname);
					},
				}),
				...options,
			};

			this.fileInterceptors = new (FilesInterceptor(
				options.fieldName,
				options.maxCount || 10,
				multerOptions,
			))();
		}
		intercept(
			...args: Parameters<NestInterceptor['intercept']>
		): Observable<any> | Promise<Observable<any>> {
			return this.fileInterceptors.intercept(...args);
		}
	}

	return mixin(Interceptor);
}

export default UploadFilesInterceptor;
