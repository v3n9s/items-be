import 'dotenv/config';
import { Joi } from 'express-validation';

interface Config {
  DATABASE_URL: string;
  PORT: number;
}

const schema = Joi.object<Config>({
  DATABASE_URL: Joi.string(),
  PORT: Joi.number().integer()
});

const config = schema.validate({
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT
}, {
  abortEarly: false,
  presence: 'required'
});

if (config.error) {
  throw new Error(config.error.details.map(({ message }) => message).join('\n'));
}

export default config.value;
