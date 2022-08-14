import config from './config';
import dataSource from './data-source';
import app from './app';

const init = async () => {
  await dataSource.initialize();
  app.listen(config.PORT);
}

init();
