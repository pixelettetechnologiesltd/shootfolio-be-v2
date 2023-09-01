"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const joi_1 = __importDefault(require("joi"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../.env") });
const envVarsSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string().valid("pod", "dev", "stage", "test").required(),
    MONGO_URI: joi_1.default.string().required().description("Mongodb URI is required"),
    PORT: joi_1.default.number().required().description("Port is required"),
    WRITE_PATH: joi_1.default.string().required(),
    JWT_SECRET: joi_1.default.string().required().description("JWT Secret is required"),
    ROOT_PATH: joi_1.default.string().required().description("Root Path is required"),
    JWT_EXPIRATION_ACCESS: joi_1.default.string()
        .required()
        .description("JWT Expiration time is required!"),
    JWT_EXPIRATION_REFRESH: joi_1.default.string()
        .required()
        .description("JWT Expiration time is required!"),
    // TWILIO_ACCOUNT_SID: Joi.string().required(),
    // TWILIO_AUTH_TOKEN: Joi.string().required(),
    // TWILIO_PHONE_NUMBER: Joi.string().required(),
    SENDGRID_TOKEN: joi_1.default.string().required(),
    SENDGRID_EMAIL_FROM: joi_1.default.string().required(),
    COIN_MARKET_API_KEY: joi_1.default.string()
        .required()
        .description("Crypto Market API Key is required"),
    CRYPTO_COIN_LATEST_URL: joi_1.default.string()
        .required()
        .description("Crypto Market API URL Latest is required"),
    CRYPTO_METADATE_URL: joi_1.default.string()
        .required()
        .description("Crypto Market API URL Latest is required"),
    STRIPE_KEY: joi_1.default.string().required().description("Stripe key is required"),
    NODE_MAILER_EMAIL: joi_1.default.string().required(),
    NODE_MAILER_PASSWORD: joi_1.default.string().required(),
    EMAIL_VERIFICATION_LINK: joi_1.default.string().required(),
    STRIPE_WEBHOOK_KEY: joi_1.default.string(),
})
    .unknown();
const { value: envVars, error } = envVarsSchema
    .prefs({
    errors: { label: "key" },
})
    .validate(process.env);
if (error) {
    throw new Error(`Config validations error: ${error.message}`);
}
const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    jwtScret: envVars.JWT_SECRET,
    jwtExpirationAccess: envVars.JWT_EXPIRATION_ACCESS,
    jwtExpirationRefresh: envVars.JWT_EXPIRATION_REFRESH,
    rootPath: envVars.ROOT_PATH,
    mongoose: {
        url: envVars.MONGO_URI + (envVars.NODE_ENV === "test" ? "-test" : ""),
    },
    // sms: {
    //   twilioSID: envVars.TWILIO_ACCOUNT_SID,
    //   twilioToken: envVars.TWILIO_AUTH_TOKEN,
    //   twilioPhone: envVars.TWILIO_PHONE_NUMBER,
    // },
    email: {
        token: envVars.SENDGRID_TOKEN,
        from: envVars.SENDGRID_EMAIL_FROM,
    },
    crypto: {
        key: envVars.COIN_MARKET_API_KEY,
        latestUrl: envVars.CRYPTO_COIN_LATEST_URL,
        metdataDataUrl: envVars.CRYPTO_METADATE_URL,
    },
    stripe: {
        key: envVars.STRIPE_KEY,
        webHookKey: envVars.STRIPE_WEBHOOK_KEY,
    },
    nodeMailer: {
        email: envVars.NODE_MAILER_EMAIL,
        password: envVars.NODE_MAILER_PASSWORD,
        verificationLink: envVars.EMAIL_VERIFICATION_LINK,
    },
};
exports.default = config;
