import { Test, TestingModule } from '@nestjs/testing';
import { MongodbServiceController } from './app.controller';
import { MongodbServiceService } from './app.service';

describe('MongodbServiceController', () => {
  let mongodbServiceController: MongodbServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MongodbServiceController],
      providers: [MongodbServiceService],
    }).compile();

    mongodbServiceController = app.get<MongodbServiceController>(MongodbServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mongodbServiceController.getHello()).toBe('Hello World!');
    });
  });
});
