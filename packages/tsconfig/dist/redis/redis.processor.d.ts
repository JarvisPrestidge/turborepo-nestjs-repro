import { ClientProxy } from "@nestjs/microservices";
import { RedisService } from "./redis.service";
import { Job, Queue } from "bull";
import { User } from "models";
export declare class RedisProcessor {
    private redisService;
    private wsGatewayService;
    private readonly redisQueue;
    private readonly logger;
    constructor(redisService: RedisService, wsGatewayService: ClientProxy, redisQueue: Queue);
    handleFindParterJob({ data }: Job<User>): Promise<void>;
    handleFindRandomParterJob({ data }: Job<User>): Promise<void>;
    onActive(job: Job): void;
    onFailed(job: Job, err: Error): void;
    onError(error: Error): void;
}
