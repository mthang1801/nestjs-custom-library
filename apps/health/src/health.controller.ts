import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller("health")
export class HealthController {
  constructor(private readonly health: HealthCheckService, private readonly typeOrmHealthIndicator : TypeOrmHealthIndicator) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.health.check([
      () => this.typeOrmHealthIndicator.pingCheck("database")
    ]);
  }
}
