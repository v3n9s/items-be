import dataSource from '../data-source';
import { User } from '../entities/user';

export const getUsers = () => {
  return dataSource.getRepository(User).find();
}

export const getUser = (id: number) => {
  return dataSource.getRepository(User).findOneBy({ id });
}
