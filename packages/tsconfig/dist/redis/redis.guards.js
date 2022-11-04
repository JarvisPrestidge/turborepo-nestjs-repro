"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptySearchResult = exports.isFTSearchArrayResponse = exports.isNumberArray = exports.isStringArray = exports.isEmptyObject = exports.isNumber = exports.isString = void 0;
const isString = (value) => {
    return typeof value === "string" ? true : false;
};
exports.isString = isString;
const isNumber = (value) => {
    return typeof value === "number" ? true : false;
};
exports.isNumber = isNumber;
const isEmptyObject = (value) => {
    return typeof value === "object" && Object.keys(value).length === 0 ? true : false;
};
exports.isEmptyObject = isEmptyObject;
const isStringArray = (value) => {
    if (!Array.isArray(value)) {
        return false;
    }
    if (value.some((v) => typeof v !== "string")) {
        return false;
    }
    return true;
};
exports.isStringArray = isStringArray;
const isNumberArray = (value) => {
    if (!Array.isArray(value)) {
        return false;
    }
    if (value.some((v) => typeof v !== "number")) {
        return false;
    }
    return true;
};
exports.isNumberArray = isNumberArray;
const isFTSearchArrayResponse = (value) => {
    return (0, exports.isNumber)(value) && value === 0 ? false : true;
};
exports.isFTSearchArrayResponse = isFTSearchArrayResponse;
const isEmptySearchResult = (value) => {
    return (0, exports.isNumber)(value) && value === 0 ? true : false;
};
exports.isEmptySearchResult = isEmptySearchResult;
//# sourceMappingURL=redis.guards.js.map