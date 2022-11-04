import { ConfigService } from "@nestjs/config";
import { Result } from "result";
import { Redisearch } from "redis-modules-sdk";
import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { User } from "models";
import { PartnerSearchResponse, RandomPartnerSearchResponse } from "models";
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    ioredis: any;
    redisearch: Redisearch;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    searchForRandomPartner(user: User): Promise<Result<RandomPartnerSearchResponse>>;
    searchForPartner(user: User): Promise<Result<PartnerSearchResponse>>;
    private buildRedisearchFieldQueryList;
    private addUserToSearchIndex;
    private removeUserFromSearchIndex;
    private searchIndex;
    private transformRedisDocumentToResult;
    private createSearchIndex;
    private buildStrictFieldQuery;
    private buildOptionalFieldQuery;
    private buildOptionalNegativeFieldQuery;
    private buildFieldQuery;
}
