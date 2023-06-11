import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

describe('EventsController', () => {
  let eventsController: EventsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [EventsService],
    }).compile();

    eventsController = app.get<EventsController>(EventsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(eventsController.getHello()).toBe('Hello World!');
    });
  });
});
