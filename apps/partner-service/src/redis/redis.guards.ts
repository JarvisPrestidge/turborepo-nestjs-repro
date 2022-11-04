import {
    FTParsedSearchResponse,
    FTSearchArrayResponse,
    FTSearchResponse
} from "redis-modules-sdk/lib/modules/redisearch/redisearch.types";

/**
 * Type guard for checking if given value is a string
 *
 * @param {unknown} value
 * @returns {value is string}
 */
export const isString = (value: unknown): value is string => {
    return typeof value === "string" ? true : false;
};

/**
 * Type guard for checking if given value is a number
 *
 * @param {unknown} value
 * @returns {value is number}
 */
export const isNumber = (value: unknown): value is number => {
    return typeof value === "number" ? true : false;
};

/**
 * Type guard for checking if given value is an empty object
 *
 * @param {unknown} value
 * @returns {*}  {value is Record<string, never>}
 */
export const isEmptyObject = (value: unknown): value is Record<string, never> => {
    return typeof value === "object" && Object.keys(value).length === 0 ? true : false;
};

/**
 * Type guard for checking if given value is a string array
 *
 * @param {unknown} value
 * @returns {value is string[]}
 */
export const isStringArray = (value: unknown): value is string[] => {
    if (!Array.isArray(value)) {
        return false;
    }

    if (value.some((v) => typeof v !== "string")) {
        return false;
    }

    return true;
};

/**
 * Type guard for checking if given value is a number array
 *
 * @param {unknown} value
 * @returns {value is number[]}
 */
export const isNumberArray = (value: unknown): value is number[] => {
    if (!Array.isArray(value)) {
        return false;
    }

    if (value.some((v) => typeof v !== "number")) {
        return false;
    }

    return true;
};

/**
 * Type guard for checking if given value is a valid FTParsedSearchResponse
 *
 * @param {FTSearchResponse} value
 * @returns {*}  {value is FTSearchArrayResponse}
 */
export const isFTSearchArrayResponse = (value: FTSearchResponse): value is FTSearchArrayResponse => {
    return isNumber(value) && value === 0 ? false : true;
};

/**
 * Type guard for checking if given value is a valid FTParsedSearchResponse
 *
 * @param {FTSearchResponse} value
 * @returns {*}  {value is FTParsedSearchResponse}
 */
export const isEmptySearchResult = (value: FTSearchResponse): value is FTParsedSearchResponse => {
    return isNumber(value) && value === 0 ? true : false;
};
