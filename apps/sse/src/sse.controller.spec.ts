import { Test, TestingModule } from '@nestjs/testing';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';

describe('SseController', () => {
  let sseController: SseController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SseController],
      providers: [SseService],
    }).compile();

    sseController = app.get<SseController>(SseController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(sseController.getHello()).toBe('Hello World!');
    });
  });
});
