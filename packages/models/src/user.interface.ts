/**
 * Represents a user
 *
 * @export
 * @interface User
 */
export interface User {
    id: string;
    data: UserData;
    preferences: UserSearchPreferences;
    partners: string[];
}

/**
 * Represents a user own data
 *
 * @export
 * @interface UserData
 */
export interface UserData {
    gender: string;
    age: number;
    interests: string[];
    country: string;
    language: string[];
}

/**
 * Represents a user's search preferences
 *
 * @export
 * @interface UserSearchPreferences
 */
export interface UserSearchPreferences {
    timeToSearch: number;
    gender: {
        enabled: boolean;
        required: boolean;
        value: string[];
    };
    age: {
        enabled: boolean;
        required: boolean;
        min: number;
        max: number;
    };
    interests: {
        enabled: boolean;
        required: boolean;
        value: string[];
    };
    country: {
        enabled: boolean;
        required: boolean;
        value: string[];
    };
    language: {
        enabled: boolean;
        required: boolean;
        value: string[];
    };
}
