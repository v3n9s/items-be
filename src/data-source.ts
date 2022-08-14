import { DataSource } from 'typeorm';
import config from './config';

export default new DataSource({
  type: 'postgres',
  url: config.DATABASE_URL
});
