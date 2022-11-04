import { WebSocket } from "ws";
import { User } from "models";
import { Queue } from "bull";
export declare class AppService {
    private readonly redisQueue;
    private logger;
    constructor(redisQueue: Queue);
    sockets: Map<string, WebSocket>;
    publishPartnerSearchEvent(user: User): Promise<void>;
    publishRandomPartnerSearchEvent(user: User): Promise<void>;
}
