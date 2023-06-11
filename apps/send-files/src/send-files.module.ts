import { Module } from '@nestjs/common';
import { SendFilesController } from './send-files.controller';
import { SendFilesService } from './send-files.service';

@Module({
  imports: [],
  controllers: [SendFilesController],
  providers: [SendFilesService],
})
export class SendFilesModule {}
