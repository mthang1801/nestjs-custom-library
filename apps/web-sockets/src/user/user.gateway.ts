import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway(5011)
export class UserGateway implements OnGatewayInit {
	server: Server;
	afterInit(server: Server) {
		this.server = server;
	}
	async create(payload: any): Promise<any> {
		console.log('UserGateway::', payload);
		const event = 'server-send-created-user';
		this.server.emit(event, { event, payload });
	}
}
