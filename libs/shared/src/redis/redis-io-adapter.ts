import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
	private adapterConstructor: ReturnType<typeof createAdapter>;
	constructor(app: any, private readonly configService: ConfigService) {
		super(app);
	}
	async connectToRedis(): Promise<void> {
		const pubClient = createClient({ url: this.getUrl() });
		const subClient = pubClient.duplicate();

		await Promise.all([pubClient.connect(), subClient.connect()]);

		this.adapterConstructor = createAdapter(pubClient, subClient);
	}

	createIOServer(port: number, options?: ServerOptions): any {
		const server = super.createIOServer(port, options);
		server.adapter(this.adapterConstructor);
		return server;
	}

	getUrl() {
		const [host, port, username, password] = [
			'REDIS_HOST',
			'REDIS_PORT',
			'REDIS_USERNAME',
			'REDIS_PASSWORD',
		].map((ele) => this.configService.get(ele));

		if (username && password)
			return `redis://${username}:${password}@${host}:${port}`;
		return `redis://${host}:${port}`;
	}
}
