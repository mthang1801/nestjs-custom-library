import { Test, TestingModule } from '@nestjs/testing';
import { SendFilesController } from './send-files.controller';
import { SendFilesService } from './send-files.service';

describe('SendFilesController', () => {
  let sendFilesController: SendFilesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SendFilesController],
      providers: [SendFilesService],
    }).compile();

    sendFilesController = app.get<SendFilesController>(SendFilesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(sendFilesController.getHello()).toBe('Hello World!');
    });
  });
});
