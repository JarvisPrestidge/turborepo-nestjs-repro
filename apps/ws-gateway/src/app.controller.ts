import { Controller, Logger } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { AppService } from "./app.service";
import { PartnerSearchResponse, RandomPartnerSearchResponse } from "models";

@Controller()
export class AppController {
    private logger: Logger = new Logger(AppController.name);

    constructor(private appService: AppService) {}

    @EventPattern("partner-found")
    public async subscribePartnerFoundEvent(data: PartnerSearchResponse) {
        const { searchingUser, matchedUser } = data;
        // this.logger.log(`[SUBSCRIBE-PARTNER-FOUND-EVENT] user: ${searchingUser.id} found partner: ${matchedUser.id}`);
        const socket = this.appService.sockets.get(data.searchingUser.id);
        if (!socket) {
            return;
        }
        socket.emit("partner-found", data);
    }

    @EventPattern("random-partner-found")
    public async subscribeRandomPartnerFoundEvent(data: RandomPartnerSearchResponse) {
        const { searchingUser, matchedUser } = data;
        this.logger.log(
            `[SUBSCRIBE-RANDOM-PARTNER-FOUND-EVENT] user: ${searchingUser.id} found partner: ${matchedUser.id}`
        );
        const socket = this.appService.sockets.get(data.searchingUser.id);
        if (!socket) {
            return;
        }
        // socket.emit("random-partner-found", data);
        const outbound = JSON.stringify({ event: "random-partner-found", data });
        socket.send(outbound);
    }
}
