import config from './config';
import dataSource from './data-source';
import app from './app';
import { scheduleDeletion } from './session-deletion-scheduler';

const init = async () => {
  await dataSource.initialize();
  await scheduleDeletion();
  app.listen(config.PORT);
}

init();
