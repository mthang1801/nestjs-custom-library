import { Test, TestingModule } from '@nestjs/testing';
import { MongoServiceController } from './mongo-service.controller';
import { MongoServiceService } from './mongo-service.service';

describe('MongoServiceController', () => {
  let mongoServiceController: MongoServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MongoServiceController],
      providers: [MongoServiceService],
    }).compile();

    mongoServiceController = app.get<MongoServiceController>(MongoServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mongoServiceController.getHello()).toBe('Hello World!');
    });
  });
});
