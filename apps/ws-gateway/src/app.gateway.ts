import { Logger } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { randomUUID } from "crypto";
import { User } from "models";
import { Server, WebSocket } from "ws";
import { AppService } from "./app.service";

@WebSocketGateway({ cors: true })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger(AppGateway.name);

    constructor(private readonly appService: AppService) {}

    @SubscribeMessage("partner-search")
    public async partnerSearch(ws: WebSocket, user: User): Promise<void> {
        await this.appService.publishPartnerSearchEvent(user);
        this.appService.sockets.set(user.id, ws);
    }

    @SubscribeMessage("random-partner-search")
    public async randomPartnerSearch(ws: WebSocket, user: User): Promise<void> {
        await this.appService.publishRandomPartnerSearchEvent(user);
        this.appService.sockets.set(user.id, ws);
    }

    public afterInit(): void {
        // this.logger.log(`[ON-INIT] Socket gateway listening`);
    }

    public async handleConnection(client: any): Promise<void> {
        client.id = randomUUID();
        // this.logger.log(`[ON-HANDLE-CONNECTION] Client connected: ${client.id}`);
    }

    public async handleDisconnect(client: any): Promise<void> {
        // this.logger.log(`[ON-HANDLE-DISCONNECT] Client disconnected: ${client.id}`);
    }
}
