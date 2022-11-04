"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const crypto_1 = require("crypto");
const ws_1 = require("ws");
const app_service_1 = require("./app.service");
let AppGateway = AppGateway_1 = class AppGateway {
    appService;
    server;
    logger = new common_1.Logger(AppGateway_1.name);
    constructor(appService) {
        this.appService = appService;
    }
    async partnerSearch(ws, user) {
        await this.appService.publishPartnerSearchEvent(user);
        this.appService.sockets.set(user.id, ws);
    }
    async randomPartnerSearch(ws, user) {
        await this.appService.publishRandomPartnerSearchEvent(user);
        this.appService.sockets.set(user.id, ws);
    }
    afterInit() {
    }
    async handleConnection(client) {
        client.id = (0, crypto_1.randomUUID)();
    }
    async handleDisconnect(client) {
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", ws_1.Server)
], AppGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("partner-search"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ws_1.WebSocket, Object]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "partnerSearch", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("random-partner-search"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ws_1.WebSocket, Object]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "randomPartnerSearch", null);
AppGateway = AppGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppGateway);
exports.AppGateway = AppGateway;
//# sourceMappingURL=app.gateway.js.map