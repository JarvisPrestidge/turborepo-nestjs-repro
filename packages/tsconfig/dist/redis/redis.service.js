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
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const constants_1 = require("../constants");
const config_1 = require("@nestjs/config");
const result_1 = require("result");
const redis_modules_sdk_1 = require("redis-modules-sdk");
const common_1 = require("@nestjs/common");
const redis_guards_1 = require("./redis.guards");
const fs_1 = require("fs");
const path_1 = require("path");
let RedisService = RedisService_1 = class RedisService {
    ioredis;
    redisearch;
    logger = new common_1.Logger(RedisService_1.name);
    constructor(configService) {
        const redisearchClient = new redis_modules_sdk_1.Redisearch({
            host: configService.get(constants_1.default.ENV_REDIS_HOST),
            port: parseInt(configService.get(constants_1.default.ENV_REDIS_PORT)),
            username: configService.get(constants_1.default.ENV_REDIS_USERNAME),
            password: configService.get(constants_1.default.ENV_REDIS_PASSWORD)
        });
        this.redisearch = redisearchClient;
    }
    async onModuleInit() {
        try {
            await this.redisearch.connect();
            this.redisearch.showDebugLogs = true;
            this.ioredis = this.redisearch.redis;
            await this.createSearchIndex();
            this.ioredis.defineCommand("searchPartner", {
                numberOfKeys: 0,
                lua: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "lua", "search.lua"), {
                    encoding: "utf8"
                })
            });
            this.ioredis.defineCommand("searchRandomPartner", {
                numberOfKeys: 0,
                lua: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "lua", "search_random.lua"), {
                    encoding: "utf8"
                })
            });
        }
        catch (error) {
            this.logger.error(`Failed to initalize Redis connection: ${error.message}`);
            throw error;
        }
    }
    async onModuleDestroy() {
        try {
            await this.redisearch.disconnect();
            this.ioredis.disconnect();
        }
        catch (error) {
            this.logger.error(`Failed to gracefully terminate Redis connection: ${error.message}`);
            throw error;
        }
    }
    async searchForRandomPartner(user) {
        const start = performance.now();
        const searchResult = await this.ioredis.searchRandomPartner(user.id);
        const finish = performance.now();
        const queryTime = finish - start;
        if (searchResult === 0) {
            return (0, result_1.Ok)();
        }
        if (searchResult > 0) {
            this.logger.error("[SEARCH-FOR-RANDOM-PARTNER ERROR] failed to add user to list");
            return (0, result_1.Err)("[SEARCH-FOR-RANDOM-PARTNER ERROR] failed to add user to list");
        }
        const result = {
            searchingUser: user,
            matchedUser: {
                id: searchResult,
                queryTime
            }
        };
        return (0, result_1.Ok)(result);
    }
    async searchForPartner(user) {
        const redisearchFieldQueryList = this.buildRedisearchFieldQueryList(user);
        const start = performance.now();
        const searchResult = await this.ioredis.searchPartner(redisearchFieldQueryList.join(" "));
        const finish = performance.now();
        const queryTime = finish - start;
        if ((0, redis_guards_1.isEmptySearchResult)(searchResult)) {
            await this.addUserToSearchIndex(user);
            return (0, result_1.Ok)();
        }
        const transformedDocument = this.transformRedisDocumentToResult(searchResult[3]);
        transformedDocument.score = searchResult[2];
        transformedDocument.queryTime = queryTime;
        const result = {
            searchingUser: user,
            matchedUser: transformedDocument
        };
        return (0, result_1.Ok)(result);
    }
    buildRedisearchFieldQueryList(user) {
        const { preferences } = user;
        const redisearchQueryList = [];
        if (preferences.age.enabled) {
            const fieldQuery = `[${preferences.age.min} ${preferences.age.max}]`;
            const ageQuery = this.buildFieldQuery(preferences.age.required, constants_1.default.REDIS_AGE_FIELD_NAME, fieldQuery);
            redisearchQueryList.push(ageQuery);
        }
        if (preferences.gender.enabled) {
            const fieldQuery = `${preferences.gender.value.join("|")}`;
            const genderQuery = this.buildFieldQuery(preferences.gender.required, constants_1.default.REDIS_GENDER_FIELD_NAME, fieldQuery);
            redisearchQueryList.push(genderQuery);
        }
        if (preferences.interests.enabled && preferences.interests.value.length) {
            const fieldQuery = `${preferences.interests.value.join("|")}`;
            const interestsQuery = this.buildFieldQuery(preferences.interests.required, constants_1.default.REDIS_INTERESTS_FIELD_NAME, fieldQuery);
            redisearchQueryList.push(interestsQuery);
        }
        if (preferences.country.enabled && preferences.country.value.length) {
            const fieldQuery = `${preferences.country.value.join("|")}`;
            const countryQuery = this.buildFieldQuery(preferences.country.required, constants_1.default.REDIS_COUNTRY_FIELD_NAME, fieldQuery);
            redisearchQueryList.push(countryQuery);
        }
        if (preferences.language.enabled && preferences.language.value.length) {
            const fieldQuery = `${preferences.language.value.join("|")}`;
            const languageQuery = this.buildFieldQuery(preferences.language.required, constants_1.default.REDIS_LANGUAGE_FIELD_NAME, fieldQuery);
            redisearchQueryList.push(languageQuery);
        }
        return redisearchQueryList;
    }
    async addUserToSearchIndex(user) {
        const { data, preferences, partners } = user;
        const hashKey = `search:user:${user.id}`;
        const genderPreference = preferences.gender.enabled
            ? preferences.gender.required
                ? preferences.gender.value.join(" ")
                : preferences.gender.value.concat("none").join(" ")
            : "none";
        const interestsPreference = preferences.interests.enabled
            ? preferences.interests.required
                ? preferences.interests.value.join(" ")
                : preferences.interests.value.concat("none").join(" ")
            : "none";
        const countryPreference = preferences.country.enabled
            ? preferences.country.required
                ? preferences.country.value.join(" ")
                : preferences.country.value.concat("none").join(" ")
            : "none";
        const languagePreference = preferences.language.enabled
            ? preferences.language.required
                ? preferences.language.value.join(" ")
                : preferences.language.value.concat("none").join(" ")
            : "none";
        const payload = {
            id: user.id,
            age: data.age,
            p_age_min: preferences.age.min,
            p_age_max: preferences.age.max,
            gender: data.gender,
            p_gender: genderPreference,
            interests: data.interests.join(" "),
            p_interests: interestsPreference,
            country: data.country,
            p_country: countryPreference,
            lang: data.language.join(" "),
            p_lang: languagePreference,
            partners: partners.join("|")
        };
        try {
            await this.ioredis.hset(hashKey, payload);
        }
        catch (error) {
            const errorMessage = `Failed to set user hash ${hashKey} in redis: ${error.message}`;
            this.logger.error(errorMessage);
            return (0, result_1.Err)(errorMessage);
        }
        return (0, result_1.Ok)();
    }
    async removeUserFromSearchIndex(userId) {
        const hashKey = `search:user:${userId}`;
        try {
            await this.ioredis.del(hashKey);
        }
        catch (error) {
            const errorMessage = `Failed to remove user ${userId} from redis: ${error.message}`;
            this.logger.error(errorMessage);
            return (0, result_1.Err)(errorMessage);
        }
        return (0, result_1.Ok)();
    }
    async searchIndex(user, fields) {
        const index = constants_1.default.REDIS_SEARCH_INDEX_NAME;
        const query = fields.join(" ");
        const params = {
            limit: {
                first: 0,
                num: 1
            },
            withScores: true
        };
        let searchResult;
        let queryTime;
        try {
            const start = performance.now();
            searchResult = await this.redisearch.search(index, query, params);
            const finish = performance.now();
            queryTime = finish - start;
        }
        catch (error) {
            const errorMessage = `Failed to search ${index} index: ${error.message}`;
            this.logger.error(errorMessage);
            return (0, result_1.Err)(errorMessage);
        }
        if (!(0, redis_guards_1.isEmptySearchResult)(searchResult)) {
            return (0, result_1.Ok)();
        }
        const { data, documentIds, resultsCount } = searchResult;
        if (!resultsCount || !(0, redis_guards_1.isStringArray)(data)) {
            return (0, result_1.Ok)();
        }
        const result = this.transformRedisDocumentToResult(data);
        const score = documentIds[1];
        result.score = score;
        result.queryTime = queryTime;
        return (0, result_1.Ok)(result);
    }
    transformRedisDocumentToResult(result) {
        const output = {};
        for (let i = 0; i < result.length; i += 2) {
            const key = result[i];
            const value = result[i + 1];
            output[key] = value;
        }
        return output;
    }
    async createSearchIndex() {
        const index = constants_1.default.REDIS_SEARCH_INDEX_NAME;
        const indexType = "HASH";
        const params = {
            prefix: {
                prefixes: "search:user:",
                num: 1
            }
        };
        const schema = [
            {
                name: constants_1.default.REDIS_GENDER_FIELD_NAME,
                type: "TEXT",
                nostem: true
            },
            {
                name: constants_1.default.REDIS_PARTNER_GENDER_FIELD_NAME,
                type: "TEXT",
                nostem: true
            },
            {
                name: constants_1.default.REDIS_AGE_FIELD_NAME,
                type: "NUMERIC"
            },
            {
                name: constants_1.default.REDIS_PARTNER_AGE_MIN_FIELD_NAME,
                type: "NUMERIC"
            },
            {
                name: constants_1.default.REDIS_PARTNER_AGE_MAX_FIELD_NAME,
                type: "NUMERIC"
            },
            {
                name: constants_1.default.REDIS_INTERESTS_FIELD_NAME,
                type: "TEXT",
                nostem: true
            },
            {
                name: constants_1.default.REDIS_PARTNER_INTERESTS_FIELD_NAME,
                type: "TEXT",
                nostem: true
            },
            {
                name: constants_1.default.REDIS_COUNTRY_FIELD_NAME,
                type: "TEXT",
                nostem: true
            },
            {
                name: constants_1.default.REDIS_PARTNER_COUNTRY_FIELD_NAME,
                type: "TEXT",
                nostem: true
            },
            {
                name: constants_1.default.REDIS_LANGUAGE_FIELD_NAME,
                type: "TEXT",
                nostem: true
            },
            {
                name: constants_1.default.REDIS_PARTNER_LANGUAGE_FIELD_NAME,
                type: "TEXT",
                nostem: true
            },
            {
                name: constants_1.default.REDIS_PARTNERS_FIELD_NAME,
                type: "TAG"
            }
        ];
        try {
            await this.redisearch.create(index, indexType, schema, params);
        }
        catch (error) {
            const errorMessage = `Failed to create ${index} index: ${error.message}`;
            this.logger.error(errorMessage);
            return (0, result_1.Err)(errorMessage);
        }
        return (0, result_1.Ok)();
    }
    buildStrictFieldQuery(fieldName, fieldQuery) {
        return `@${fieldName}:${fieldQuery}`;
    }
    buildOptionalFieldQuery(fieldName, fieldQuery) {
        return `(~@${fieldName}:${fieldQuery})`;
    }
    buildOptionalNegativeFieldQuery(fieldName, fieldQuery) {
        return `~(-@${fieldName}:${fieldQuery})`;
    }
    buildFieldQuery(isRequired, fieldName, fieldQuery) {
        return isRequired
            ? this.buildStrictFieldQuery(fieldName, fieldQuery)
            : this.buildOptionalFieldQuery(fieldName, fieldQuery);
    }
};
RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
exports.RedisService = RedisService;
//# sourceMappingURL=redis.service.js.map