import { NestFactory } from "@nestjs/core";
import { parentPort, workerData } from "worker_threads";
import { WorkerThreadsModule } from "../worker-threads.module";
import { WorkerThreadsService } from "../worker-threads.service";

async function run() {
  const app = new NestFactory.createApplicationContext(WorkerThreadsModule)
  const appService = app.get(WorkerThreadsService);
  console.log("Worker thread got data:", workerData);
  appService.blocking(workerData.cpuTimeMs)
  parentPort.postMessage(workerData)
}

run()