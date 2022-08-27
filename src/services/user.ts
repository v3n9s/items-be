import { FindOptionsWhere } from 'typeorm';
import dataSource from '../data-source';
import { User } from '../entities/user';

export const getUsers = () => {
  return dataSource.getRepository(User).find();
}

export const getUser = (where: FindOptionsWhere<User>) => {
  return dataSource.getRepository(User).findOneBy(where);
}
