import C from "../constants";
import { ClientProxy } from "@nestjs/microservices";
import { Inject, Logger } from "@nestjs/common";
import { InjectQueue, OnQueueActive, OnQueueError, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { User } from "models";

@Processor("redis")
export class RedisProcessor {
    private readonly logger = new Logger(RedisProcessor.name);

    constructor(
        @Inject(C.WS_GATEWAY_SERVICE_NAME) private wsGatewayService: ClientProxy,
        @InjectQueue("redis") private readonly redisQueue: Queue
    ) {}

    @Process({ name: "partner-search", concurrency: 20 })
    public async handleFindParterJob({ data }: Job<User>): Promise<void> {
        // this.logger.log(`[PARTNER-SEARCH START]: pid: ${process.pid} processing job for user: ${JSON.stringify(data)}`);

        const start = performance.now();
        try {
            this.wsGatewayService.emit("partner-found", {});
        } catch (error) {
            this.logger.error(`[PARTNER-SEARCH ERROR] Error searching for partner - reason: ${error.message}`);
        }

        const finish = performance.now();
        const msTime = finish - start;

        // this.logger.log(`[PARTNER-SEARCH END]: processed job in ${msTime} ms`);
    }

    @Process({ name: "random-partner-search", concurrency: 20 })
    public async handleFindRandomParterJob({ data }: Job<User>): Promise<void> {
        // this.logger.log(`[RANDOM-PARTNER-SEARCH START]: pid: ${process.pid} processing job for user: ${JSON.stringify(data)}`);

        const start = performance.now();
        try {
            this.wsGatewayService.emit("random-partner-found", {});
        } catch (error) {
            this.logger.error(`[RANDOM-PARTNER-SEARCH ERROR] Error searching for partner - reason: ${error.message}`);
        }

        const finish = performance.now();
        const msTime = finish - start;

        this.logger.log(`[RANDOM-PARTNER-SEARCH END]: processed job in ${msTime} ms`);
    }

    @OnQueueActive()
    onActive(job: Job) {
        // this.logger.log(`[REDIS-JOB-ACTIVE] Processing job ${job.id}...`);
    }

    @OnQueueFailed()
    onFailed(job: Job, err: Error) {
        this.logger.error(`[REDIS-JOB-FAILED] Job Failed with id ${job.id} and with reason: ${err.message}`);
    }

    @OnQueueError()
    onError(error: Error) {
        this.logger.error(`[REDIS-JOB-ERROR] An error occurred while processing a job, error: ${error.message}`);
    }
}

// /**
//  * Event handler that triggers on job completion
//  *
//  * @param {Job} job
//  * @param {(PartnerSearchResponse | Record<string, never>)} result
//  */
// @OnQueueCompleted()
// async onCompleted(job: Job, result: PartnerSearchResponse | Record<string, never>) {
//     const waitingJobCount = await this.redisQueue.getWaitingCount();
//     // this.logger.log(`[REDIS-JOB-COMPLETED]: finished processing job ${job.id}; there are ${waitingJobCount} left in queue`);
//     if (!isEmptyObject(result)) {
//         this.wsGatewayService.emit("partner-found", result);
//     }
// }
