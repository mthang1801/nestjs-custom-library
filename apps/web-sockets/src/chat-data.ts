import { v4 as uuid } from 'uuid';

export class Chat {
	static data: Chat[] = [];

	id: string = uuid();
	sender_id: string | any;
	receiver_id: string | any;
	text: string;
	created_at: Date = new Date();

	constructor(partial: Partial<Chat>) {
		Object.assign(partial);
	}
}
