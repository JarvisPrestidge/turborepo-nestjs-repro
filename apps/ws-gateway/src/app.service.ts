import { Injectable, Logger } from "@nestjs/common";
import { WebSocket } from "ws";
import { User } from "models";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class AppService {
    private logger: Logger = new Logger(AppService.name);

    constructor(@InjectQueue("redis") private readonly redisQueue: Queue) {}

    public sockets = new Map<string, WebSocket>();

    async publishPartnerSearchEvent(user: User) {
        // this.logger.log(`[PUBLISH-PARTNER-SEARCH-EVENT] for user: ${user.id}`);
        await this.redisQueue.add("partner-search", user);
    }

    async publishRandomPartnerSearchEvent(user: User) {
        // this.logger.log(`[PUBLISH-RANDOM-PARTNER-SEARCH-EVENT] for user: ${user.id}`);
        await this.redisQueue.add("random-partner-search", user);
    }
}
