import { FindOptionsWhere } from 'typeorm';
import dataSource from '../data-source';
import { User } from '../entities/user';

export const getUsers = () => {
  return dataSource.getRepository(User).find();
}

export const getUser = (id: number) => {
  return dataSource.getRepository(User).findOneBy({ id });
}

export const getSafeUser = (where: FindOptionsWhere<User>) => {
  return dataSource.getRepository(User).findOne({
    where,
    select: {
      id: true,
      name: true,
      isAdmin: true,
      isBlocked: true
    }
  });
}
