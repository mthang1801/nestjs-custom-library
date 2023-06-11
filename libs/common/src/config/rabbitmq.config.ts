import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
	host: process.env.RMQ_HOST,
	port: process.env.RMQ_PORT,
	username: process.env.RMQ_USERNAME,
	password: process.env.RMQ_PASSWORD,
	vHost: process.env.RMQ_VHOST,
}));
