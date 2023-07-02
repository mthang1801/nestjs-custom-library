import { WsExceptionFilter } from '@app/shared/filter/ws-exception.filter';
import { WebsocketInterceptor } from '@app/shared/interceptors/websocket.interceptor';
import { UseFilters, UseInterceptors } from '@nestjs/common';
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WsException,
} from '@nestjs/websockets';
import { from, reduce } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateUser } from './dto/update-user.dto';
import { User } from './user/user-data';

@WebSocketGateway(5011, { namespace: 'dni-internal' })
@UseInterceptors(WebsocketInterceptor)
export class WebsocketNamespace
	implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
	server: Server;
	afterInit(server: Server) {
		this.server = server;
	}
	handleConnection(client: Socket, ...args: any[]) {
		User.data = User.data.map((user) => {
			if (user.id === client.handshake.headers?.['x-client-id']) {
				user.socket_ids.push(client.id);
			}
			return user;
		});
	}

	handleDisconnect(client: Socket) {
		User.data = User.data.map((user) => {
			if (user.id === client.handshake.headers?.['x-client-id']) {
				user.socket_ids = user.socket_ids.filter(
					(socketId) => socketId !== client.id,
				);
			}
			return user;
		});
	}

	@SubscribeMessage('send-to-server-messenger')
	async sendToServerEvents(
		@MessageBody() payload: SendMessageDto,
		@ConnectedSocket() socket: Socket,
	) {
		const receiverData = User.data.find(
			(user) => user.id === payload.receiver_id,
		);
		if (!receiverData) throw new WsException('User not Found');
		receiverData.socket_ids.forEach((socketId) => {
			socket.to(socketId).emit('server-send-messenger', payload);
		});
	}

	@SubscribeMessage('send-to-server-calculate-sum')
	async onCalculateSum(
		@MessageBody('numbers') payload: number[],
		@ConnectedSocket() socket: Socket,
	) {
		const events = 'server-send-calculate-sum';
		return from(payload).pipe(
			reduce((acc, val) => {
				const currentSum = acc + val;
				socket.emit(events, { currentSum });
				return currentSum;
			}),
		);
	}

	@SubscribeMessage('send-to-server-update-user')
	@UseFilters(new WsExceptionFilter())
	async updateUser(
		@MessageBody() payload: UpdateUser,
		@ConnectedSocket() socket: Socket,
	) {
		const event = 'server-send-update-user';
		const userIndex = User.data.findIndex(
			(user) => user.id === socket.handshake.headers?.['x-client-id'],
		);

		if (userIndex === -1) throw new WsException('User not found');

		const udpatedUser = {
			...User.data[userIndex],
			...payload,
			updated_at: new Date(),
		};

		User.data[userIndex] = udpatedUser;

		User.data[userIndex].socket_ids.forEach((socketId) => {
			socket.to(socketId).emit(event, udpatedUser);
		});

		return udpatedUser;
	}
}
