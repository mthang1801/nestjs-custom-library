import { Controller, Get } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller()
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Get()
	getHello(): string {
		return this.eventsService.getHello();
	}
}
