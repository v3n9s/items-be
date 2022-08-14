import 'dotenv/config';

const variables = {
  DATABASE_URL: process.env.DATABASE_URL!
};

const emptyVars = Object.entries(variables).filter(([, v]) => v === undefined).map(([k]) => k);

if (emptyVars.length) {
  throw new Error(`Environment variables [${emptyVars.join(', ')}] are not defined`);
}

export default variables;
