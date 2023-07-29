import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { env } from 'process';
import * as winston from 'winston';
import 'winston-mongodb';

const tranportFile = (fileName: string, level = 'info') => {
	return new winston.transports.File({
		filename: fileName,
		level,
		format: winston.format.combine(
			winston.format.timestamp({
				format: 'DD/MM/YYYY HH:mm:ss',
			}),
			winston.format.json(),
		),
	});
};

const transportMongoDB = () => {
	const {
		MONGO_PRIMARY_USERNAME,
		MONGO_PRIMARY_PASSWORD,
		MONGO_PRIMARY_HOST,
		MONGO_PRIMARY_PORT,
		MONGO_DATABASE,
	} = env;

	return new winston.transports.MongoDB({
		level: 'info',
		db: `mongodb://${MONGO_PRIMARY_USERNAME}:${MONGO_PRIMARY_PASSWORD}@${MONGO_PRIMARY_HOST}:${MONGO_PRIMARY_PORT}`,
		dbName: MONGO_DATABASE,
	});
};

export const WinstonLogger = (appName = 'NestJS') => {
	return WinstonModule.createLogger({
		transports: [
			new winston.transports.Console({
				format: winston.format.combine(
					winston.format.timestamp({
						format: 'DD/MM/YYYY HH:mm:ss',
					}),
					winston.format.uncolorize(),
					winston.format.printf(
						(info) =>
							`${info.timestamp} ${info.level}: ${info.message}` +
							(info.splat !== undefined ? `${info.splat}` : ' '),
					),
					winston.format.json(),
					nestWinstonModuleUtilities.format.nestLike(appName, {
						colors: true,
						prettyPrint: true,
					}),
				),
			}),
			tranportFile('logs/_error.log', 'error'),
			tranportFile('logs/_warn.log', 'warn'),
			tranportFile('logs/_combined.log'),
			transportMongoDB(),
		],
	});
};
