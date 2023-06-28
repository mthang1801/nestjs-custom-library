import { extraModels, includes } from '@app/common/swagger';
import { NestApplication } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { join } from 'path';
import { ENUM_FAV_ICON, ENUM_SWAGGER_THEME } from '../constants/enum';
import { SwaggerSetupOptions } from '../types';

export const SetupSwagger = (
	app: NestApplication | NestExpressApplication,
	options?: SwaggerSetupOptions,
) => {
	app.useStaticAssets(join(process.cwd(), 'public'));
	const swaggerConfig = new DocumentBuilder()
		.setTitle('API NestJS')
		.setDescription('API developed throughout the API with NestJS course')
		.setVersion('1.0.0')
		.setContact(
			'mthang',
			'https://mvt-blog-official.netlify.app/',
			'mthang1801@gmail.com',
		)
		.setLicense('API NestJS', 'localhost')
		.addTag('Nội dung')
		.addBearerAuth({
			type: 'apiKey',
			description: 'input accessToken',
			name: 'JSON Token',
			in: 'ThisIsAccessToken',
		})
		.build();

	const swaggerOptions: SwaggerDocumentOptions = {
		operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
		ignoreGlobalPrefix: true,
		include: includes,
		extraModels: extraModels,
	};

	const document = SwaggerModule.createDocument(
		app,
		swaggerConfig,
		swaggerOptions,
	);

	SwaggerModule.setup('docs', app, document, {
		explorer: true,
		customCssUrl: options?.theme
			? `../../swagger-ui/${ENUM_SWAGGER_THEME[options.theme]}`
			: undefined,
		customSiteTitle: options?.title ?? undefined,
		customfavIcon: options?.icon
			? `../../images/logo/${ENUM_FAV_ICON[options.icon]}`
			: `../../images/logo/${ENUM_FAV_ICON.DEFAULT}`,
		customJsStr: [
			'console.log("Hello World")',
			`
        var x = 1 + 1 ;
        console.log(x)
        `,
		],
	});
};
