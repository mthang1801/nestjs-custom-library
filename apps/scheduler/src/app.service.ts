import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
@Injectable()
export class AppService {
	private promotion = {
		id: 1,
		name: 'Promotion In July',
		description: 'Promotion In July',
		status: 'INIT',
		created_at: new Date(),
		begin_display_at: new Date('2023-06-30T05:37:00'),
		end_display_at: new Date('2023-06-30T05:37:15'),
	};
	private readonly logger = new Logger(AppService.name);
	constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

	// @Timeout(Date.now().toString(), 500)
	testCron() {
		this.addCronJob();
	}

	addCronJob() {
		const jobBeginDisplayAt = new CronJob(
			this.promotion.begin_display_at,
			() => {
				this.logger.log('Job Begin display at');
				this.promotion.status = 'IN_PROGRESS';
				console.log(this.promotion);
			},
		);
		const jobEndDisplayAt = new CronJob(this.promotion.end_display_at, () => {
			this.logger.log('Job end display at');
			this.promotion.status = 'EXPIRED';
			console.log(this.promotion);
			console.log(this.promotion);
		});
		this.schedulerRegistry.addCronJob(
			`promotion:begin:${this.promotion.id}`,
			jobBeginDisplayAt,
		);
		this.schedulerRegistry.addCronJob(
			`promotion:end:${this.promotion.id}`,
			jobEndDisplayAt,
		);
		jobBeginDisplayAt.start();
		jobEndDisplayAt.start();
	}

	findAllCronJobs() {
		const jobs = this.schedulerRegistry.getCronJobs();
		jobs.forEach((value, key, map) => {
			const next = value.nextDate();
			this.logger.log(`job ${key} has value ${value} -> ${next}`);
		});
	}
}
