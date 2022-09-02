import 'dotenv/config';
import { Joi } from 'express-validation';

interface Config {
  DATABASE_URL: string;
  PORT: number;
  JWT_ACCESS_SECRET_KEY: string;
  JWT_ACCESS_EXPIRE_HOURS: number;
  JWT_ACCESS_EXPIRE_MS: number;
  JWT_REFRESH_SECRET_KEY: string;
  JWT_REFRESH_EXPIRE_DAYS: number;
  JWT_REFRESH_EXPIRE_MS: number;
  IS_HEROKU: boolean;
}

const schema = Joi.object<Readonly<Config>>({
  DATABASE_URL: Joi.string(),
  PORT: Joi.number().integer(),
  JWT_ACCESS_SECRET_KEY: Joi.string(),
  JWT_ACCESS_EXPIRE_HOURS: Joi.number(),
  JWT_ACCESS_EXPIRE_MS: Joi.number(),
  JWT_REFRESH_SECRET_KEY: Joi.string(),
  JWT_REFRESH_EXPIRE_DAYS: Joi.number(),
  JWT_REFRESH_EXPIRE_MS: Joi.number(),
  IS_HEROKU: Joi.boolean()
});

const config = schema.validate({
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_EXPIRE_HOURS: process.env.JWT_ACCESS_EXPIRE_HOURS,
  get JWT_ACCESS_EXPIRE_MS() {
    return this.JWT_ACCESS_EXPIRE_HOURS * 60 * 60 * 1000;
  },
  JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_EXPIRE_DAYS: process.env.JWT_REFRESH_EXPIRE_DAYS,
  get JWT_REFRESH_EXPIRE_MS() {
    return this.JWT_REFRESH_EXPIRE_DAYS * 24 * 60 * 60 * 1000;
  },
  IS_HEROKU: process.env.IS_HEROKU
} as {[key in keyof Config]: any}, {
  abortEarly: false,
  presence: 'required'
});

if (config.error) {
  throw new Error(config.error.details.map(({ message }) => message).join('\n'));
}

export default config.value;
