import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { WorkerThreadFilePath } from './worker/config';

@Injectable()
export class WorkerThreadsService {
	async worker(cpuTimeMs: number) {
		const startTime = Date.now();
		return new Promise((resolve, reject) => {
      console.log(`${__dirname}/worker/worker.js`)
			while (Date.now() - startTime < cpuTimeMs) {
				const worker = new Worker(`${__dirname}/worker/worker.js`, {
					workerData: { cpuTimeMs },
				});
				worker.on('message', (message) => {
					console.log('Main thread got message:', message);
					resolve(message);
				});

				worker.on('error', (err) => {
					console.log('Worker threw error::', err);
					reject(err);
				});
			}
		});
	}

	blocking(cpuTimeMs: number) {
		const startTime = Date.now();

		while (Date.now() - startTime < cpuTimeMs) {}
	}
}
