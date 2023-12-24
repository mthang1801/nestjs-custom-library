import { Controller, Get, Query } from '@nestjs/common';
import { WorkerThreadsService } from './worker-threads.service';

@Controller()
export class WorkerThreadsController {
	constructor(private readonly workerThreadsService: WorkerThreadsService) {}

	@Get('worker')
	async worker(@Query('cpuTimeMs') cpuTimeMs: string) {
		await this.workerThreadsService.worker(Number(cpuTimeMs));
	}
	@Get('blocking')
	blocking(@Query('cpuTimeMs') cpuTimeMs: string) {
		this.workerThreadsService.blocking(Number(cpuTimeMs));
	}
}
