import { Module } from '@nestjs/common';
import { SerializerController } from './serializer.controller';
import { SerializerService } from './serializer.service';

@Module({
	imports: [],
	controllers: [SerializerController],
	providers: [SerializerService],
})
export class SerializerModule {}
