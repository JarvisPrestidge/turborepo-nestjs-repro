import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { User } from "models";
import { Server, WebSocket } from "ws";
import { AppService } from "./app.service";
export declare class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly appService;
    server: Server;
    private logger;
    constructor(appService: AppService);
    partnerSearch(ws: WebSocket, user: User): Promise<void>;
    randomPartnerSearch(ws: WebSocket, user: User): Promise<void>;
    afterInit(): void;
    handleConnection(client: any): Promise<void>;
    handleDisconnect(client: any): Promise<void>;
}
