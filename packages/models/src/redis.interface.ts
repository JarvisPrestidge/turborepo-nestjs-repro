import { User } from "./user.interface";

/**
 * A random partner search response
 *
 * @export
 * @interface PartnerSearchResponse
 */
export interface RandomPartnerSearchResponse {
    searchingUser: User;
    matchedUser: {
        id: string;
        queryTime: number;
    };
}

/**
 * A partner search response
 *
 * @export
 * @interface PartnerSearchResponse
 */
export interface PartnerSearchResponse {
    searchingUser: User;
    matchedUser: MatchedUser;
}

/**
 * Represents the redis payload fields for a searching user
 *
 * @export
 * @interface UserFoundResponse
 */
export interface MatchedUser extends IndexableInterface {
    id: string;
    gender: string;
    p_gender: string;
    age: number;
    p_age_min: number;
    p_age_max: number;
    interests: string;
    p_interests: string;
    country: string;
    p_country: string;
    lang: string;
    p_lang: string;
}

/**
 * Base interface for indexable fields
 *
 * @export
 * @interface IndexableInterface
 */
export interface IndexableInterface {
    [index: string]: string | number;
}

/**
 * Represents the redisearch result type
 *
 * @export
 * @type FTSearchResult
 */
export type FTSearchResult =
    | number
    | [
          number,
          ...Array<
              | string
              | string[]
              | {
                    [key: string]: string;
                }
          >
      ];
