import { Test, TestingModule } from '@nestjs/testing';
import { RedisDynamicController } from './redis-dynamic.controller';
import { RedisDynamicService } from './redis-dynamic.service';

describe('RedisDynamicController', () => {
  let redisDynamicController: RedisDynamicController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RedisDynamicController],
      providers: [RedisDynamicService],
    }).compile();

    redisDynamicController = app.get<RedisDynamicController>(RedisDynamicController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(redisDynamicController.getHello()).toBe('Hello World!');
    });
  });
});
