import './config';
import dataSource from './data-source';

const init = async () => {
  await dataSource.initialize();
}

init();
