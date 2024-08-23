import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('pod', 'dev', 'stage', 'test').required(),
    MONGO_URI: Joi.string().required().description('Mongodb URI is required'),
    PORT: Joi.number().required().description('Port is required'),
    WRITE_PATH: Joi.string().required(),
    JWT_SECRET: Joi.string().required().description('JWT Secret is required'),
    ROOT_PATH: Joi.string().required().description('Root Path is required'),
    JWT_EXPIRATION_ACCESS: Joi.string()
      .required()
      .description('JWT Expiration time is required!'),
    JWT_EXPIRATION_REFRESH: Joi.string()
      .required()
      .description('JWT Expiration time is required!'),
    // TWILIO_ACCOUNT_SID: Joi.string().required(),
    // TWILIO_AUTH_TOKEN: Joi.string().required(),
    // TWILIO_PHONE_NUMBER: Joi.string().required(),
    SENDGRID_TOKEN: Joi.string().required(),
    SENDGRID_EMAIL_FROM: Joi.string().required(),
    COIN_MARKET_API_KEY: Joi.string()
      .required()
      .description('Crypto Market API Key is required'),
    CRYPTO_COIN_LATEST_URL: Joi.string()
      .required()
      .description('Crypto Market API URL Latest is required'),
    CRYPTO_METADATE_URL: Joi.string()
      .required()
      .description('Crypto Market API URL Latest is required'),
    STRIPE_KEY: Joi.string().required().description('Stripe key is required'),

    NODE_MAILER_EMAIL: Joi.string().required(),
    NODE_MAILER_PASSWORD: Joi.string().required(),
    EMAIL_VERIFICATION_LINK: Joi.string().required(),

    SMTP_PORT: Joi.string().required(),
    SMTP_HOST: Joi.string().required(),
    SMTP_SECURE: Joi.string(),

    STRIPE_WEBHOOK_KEY: Joi.string(),
    ACCESS_KEY: Joi.string(),
    SECRET_KEY: Joi.string(),
    SPACE_NAME: Joi.string(),
    SPACE_ENDPOINT: Joi.string(),
    SPACE_URL: Joi.string(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({
    errors: { label: 'key' },
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
    url: envVars.MONGO_URI + (envVars.NODE_ENV === 'test' ? '-test' : ''),
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
    smtpHost: envVars.SMTP_HOST,
    smtpPort: envVars.SMTP_PORT,
    email: envVars.NODE_MAILER_EMAIL,
    password: envVars.NODE_MAILER_PASSWORD,
    verificationLink: envVars.EMAIL_VERIFICATION_LINK,
  },
  digitalOcean: {
    access: envVars.ACCESS_KEY,
    secret: envVars.SECRET_KEY,
    spaceName: envVars.SPACE_NAME,
    endpoint: envVars.SPACE_ENDPOINT,
    url: envVars.SPACE_URL,
  },
};

export default config;
