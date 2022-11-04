import { FTParsedSearchResponse, FTSearchResponse } from "redis-modules-sdk/lib/modules/redisearch/redisearch.types";
export declare const isString: (value: unknown) => value is string;
export declare const isNumber: (value: unknown) => value is number;
export declare const isEmptyObject: (value: unknown) => value is Record<string, never>;
export declare const isStringArray: (value: unknown) => value is string[];
export declare const isNumberArray: (value: unknown) => value is number[];
export declare const isFTSearchArrayResponse: (value: FTSearchResponse) => value is [number, ...(string | string[] | {
    [key: string]: string;
})[]];
export declare const isEmptySearchResult: (value: FTSearchResponse) => value is FTParsedSearchResponse;
