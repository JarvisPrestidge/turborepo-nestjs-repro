import { toString } from "./utils";

// export type Result<T, E = void> = E extends void ? OkImpl<T, Error> | ErrImpl<T, Error> : OkImpl<T, E> | ErrImpl<T, E>;
export type Result<ResultType = void> = Ok<ResultType> | Err;

/**
 * Contains the result value on success
 *
 * @export
 * @class OkImpl
 * @template ResultType
 */
export class OkImpl<ResultType> {
    public readonly ok: true;
    public readonly err: false;
    public readonly result: ResultType;

    public constructor(result?: ResultType) {
        if (result !== undefined) {
            this.result = result;
        }
    }

    public isOk(): this is OkImpl<ResultType> {
        return true;
    }

    public isErr(): this is ErrImpl {
        return false;
    }

    public isErrOrEmpty(): this is ErrImpl {
        return this.result === undefined;
    }

    public unwrap(): ResultType {
        return this.result;
    }

    public unwrapOr(): ResultType {
        return this.result;
    }

    public expect(): ResultType {
        return this.result;
    }
}

/**
 * Contains the error result on failure
 *
 * @export
 * @class ErrImpl
 */
export class ErrImpl {
    public readonly ok: false;
    public readonly err: true;
    public readonly reason: Error;

    public constructor(error: string | Error) {
        this.reason = typeof error === "string" ? new Error(error) : error;
    }

    public isOk(): this is OkImpl<unknown> {
        return false;
    }

    public isErr(): this is ErrImpl {
        return true;
    }

    public isErrOrEmpty(): this is ErrImpl {
        return true;
    }

    public unwrap(): never {
        throw new Error(`Tried to unwrap Error: ${toString(this.reason)}`);
    }

    public unwrapOr<DefaultType>(fallback: DefaultType): DefaultType {
        return fallback;
    }

    public expect(msg: string): never {
        throw new Error(`${msg} - Error: ${toString(this.reason)}`);
    }
}

/**
 * Contains the result value on success
 *
 * @template ResultType
 * @param {ResultType} [value]
 * @returns {OkImpl<ResultType>}
 */
export const Ok = <ResultType>(value?: ResultType): OkImpl<ResultType> => new OkImpl(value);
export type Ok<ResultType> = OkImpl<ResultType>;

/**
 * Contains the error values on failure
 *
 * @param {(string | Error)} error
 * @returns {ErrImpl}
 */
export const Err = (error: string | Error): ErrImpl => new ErrImpl(error);
export type Err = ErrImpl;
