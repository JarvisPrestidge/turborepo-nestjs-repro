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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RedisProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisProcessor = void 0;
const constants_1 = require("../constants");
const microservices_1 = require("@nestjs/microservices");
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const redis_service_1 = require("./redis.service");
let RedisProcessor = RedisProcessor_1 = class RedisProcessor {
    redisService;
    wsGatewayService;
    redisQueue;
    logger = new common_1.Logger(RedisProcessor_1.name);
    constructor(redisService, wsGatewayService, redisQueue) {
        this.redisService = redisService;
        this.wsGatewayService = wsGatewayService;
        this.redisQueue = redisQueue;
    }
    async handleFindParterJob({ data }) {
        const start = performance.now();
        try {
            const partnerSearchResult = await this.redisService.searchForPartner(data);
            const partnerSearch = partnerSearchResult.unwrap();
            this.wsGatewayService.emit("partner-found", partnerSearch);
        }
        catch (error) {
            this.logger.error(`[PARTNER-SEARCH ERROR] Error searching for partner - reason: ${error.message}`);
        }
        const finish = performance.now();
        const msTime = finish - start;
    }
    async handleFindRandomParterJob({ data }) {
        const start = performance.now();
        try {
            const randomPartnerSearchResult = await this.redisService.searchForRandomPartner(data);
            const randomPartner = randomPartnerSearchResult.unwrap();
            if (randomPartner) {
                this.wsGatewayService.emit("random-partner-found", randomPartner);
            }
        }
        catch (error) {
            this.logger.error(`[RANDOM-PARTNER-SEARCH ERROR] Error searching for partner - reason: ${error.message}`);
        }
        const finish = performance.now();
        const msTime = finish - start;
        this.logger.log(`[RANDOM-PARTNER-SEARCH END]: processed job in ${msTime} ms`);
    }
    onActive(job) {
    }
    onFailed(job, err) {
        this.logger.error(`[REDIS-JOB-FAILED] Job Failed with id ${job.id} and with reason: ${err.message}`);
    }
    onError(error) {
        this.logger.error(`[REDIS-JOB-ERROR] An error occurred while processing a job, error: ${error.message}`);
    }
};
__decorate([
    (0, bull_1.Process)({ name: "partner-search", concurrency: 20 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RedisProcessor.prototype, "handleFindParterJob", null);
__decorate([
    (0, bull_1.Process)({ name: "random-partner-search", concurrency: 20 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RedisProcessor.prototype, "handleFindRandomParterJob", null);
__decorate([
    (0, bull_1.OnQueueActive)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RedisProcessor.prototype, "onActive", null);
__decorate([
    (0, bull_1.OnQueueFailed)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Error]),
    __metadata("design:returntype", void 0)
], RedisProcessor.prototype, "onFailed", null);
__decorate([
    (0, bull_1.OnQueueError)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Error]),
    __metadata("design:returntype", void 0)
], RedisProcessor.prototype, "onError", null);
RedisProcessor = RedisProcessor_1 = __decorate([
    (0, bull_1.Processor)("redis"),
    __param(1, (0, common_1.Inject)(constants_1.default.WS_GATEWAY_SERVICE_NAME)),
    __param(2, (0, bull_1.InjectQueue)("redis")),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        microservices_1.ClientProxy, Object])
], RedisProcessor);
exports.RedisProcessor = RedisProcessor;
//# sourceMappingURL=redis.processor.js.map