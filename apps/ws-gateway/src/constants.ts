import { join } from "path";

/**
 * Project wide constants
 *
 * @export
 * @class Constants
 */
export default class Constants {
    // Constant variables
    public static readonly SERVER_PORT = 3000;
    public static readonly SERVER_DOMAIN = "localhost";

    // Microservices
    public static readonly PARTNER_SERVICE_NAME = "PARTNER_SERVICE";

    // Redis
    public static readonly REDIS_SEARCH_INDEX_NAME = "search_idx";
    public static readonly REDIS_AGE_FIELD_NAME = "age";
    public static readonly REDIS_PARTNER_AGE_MIN_FIELD_NAME = "p_age_min";
    public static readonly REDIS_PARTNER_AGE_MAX_FIELD_NAME = "p_age_max";
    public static readonly REDIS_GENDER_FIELD_NAME = "gender";
    public static readonly REDIS_PARTNER_GENDER_FIELD_NAME = "p_gender";
    public static readonly REDIS_INTERESTS_FIELD_NAME = "interests";
    public static readonly REDIS_PARTNER_INTERESTS_FIELD_NAME = "p_interests";
    public static readonly REDIS_COUNTRY_FIELD_NAME = "country";
    public static readonly REDIS_PARTNER_COUNTRY_FIELD_NAME = "p_country";
    public static readonly REDIS_LANGUAGE_FIELD_NAME = "lang";
    public static readonly REDIS_PARTNER_LANGUAGE_FIELD_NAME = "p_lang";
    public static readonly REDIS_PARTNERS_FIELD_NAME = "partners";
    public static readonly REDIS_VERIFIED_FIELD_NAME = "verified";
    public static readonly REDIS_GOLD_FIELD_NAME = "gold";

    // Environment variables
    public static readonly ENV_JWT_SECRET = "JWT_SECRET";
    public static readonly ENV_JWT_EXPIRES_IN = "JWT_EXPIRES_IN";
    public static readonly ENV_OAUTH_GOOGLE_CLIENT_ID = "OAUTH_GOOGLE_CLIENT_ID";
    public static readonly ENV_OAUTH_GOOGLE_CLIENT_SECRET = "OAUTH_GOOGLE_CLIENT_SECRET";
    public static readonly ENV_OAUTH_GOOGLE_REDIRECT_URL = "OAUTH_GOOGLE_REDIRECT_URL";

    public static readonly ENV_REDIS_HOST = "REDIS_HOST";
    public static readonly ENV_REDIS_PORT = "REDIS_PORT";
    public static readonly ENV_REDIS_USERNAME = "REDIS_USER";
    public static readonly ENV_REDIS_PASSWORD = "REDIS_PASSWORD";
    public static readonly ENV_REDIS_CACHE_TTL = "REDIS_CACHE_TTL";

    // Metadata
    public static readonly USER_AGENT =
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36";

    // Build Paths
    public static readonly PROJECT_ROOT_PATH = join(__dirname, "..", "..");
    public static readonly PROJECT_APPS_PATH = join(__dirname, "..");
    public static readonly PROJECT_OUTPUT_PATH = join(Constants.PROJECT_ROOT_PATH, "output");
    public static readonly PROJECT_RESOURCES_PATH = join(Constants.PROJECT_ROOT_PATH, "resources");
}
