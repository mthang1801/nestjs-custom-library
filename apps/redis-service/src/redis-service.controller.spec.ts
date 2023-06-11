import { Test, TestingModule } from '@nestjs/testing';
import { RedisServiceController } from './redis-service.controller';
import { RedisServiceService } from './redis-service.service';

describe('RedisServiceController', () => {
  let redisServiceController: RedisServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RedisServiceController],
      providers: [RedisServiceService],
    }).compile();

    redisServiceController = app.get<RedisServiceController>(RedisServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(redisServiceController.getHello()).toBe('Hello World!');
    });
  });
});
