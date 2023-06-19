import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicatorResult } from '@nestjs/terminus';

interface User {
	id: number;
	firstName: string;
	lastName: string;
}

@Injectable()
export class HealthService {
	private users: User[] = [
		{ id: 1, firstName: 'John', lastName: 'Doe' },
		{ id: 2, firstName: 'Jane', lastName: 'Sece' },
	];

	async isHealthy(key: string): Promise<HealthIndicatorResult> {
		const johns = this.users.filter(({ firstName }) => firstName === 'John');
		const isHealthy = johns.length;
		const result = this.getStatus(key, isHealthy);

		if (isHealthy) return result;
		throw new HealthCheckError('Custom Health failed', result);
	}

	getStatus(key, isHealthy): HealthIndicatorResult {
		return {
			[key]: {
				status: isHealthy ? 'up' : 'down',
				message: isHealthy ? undefined : 'Custom Health Failed',
			},
		};
	}
}
