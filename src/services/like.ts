import { FindOptionsWhere } from 'typeorm';
import dataSource from '../data-source';
import { Like } from '../entities/like';

export const getLikes = async (where: FindOptionsWhere<Like>) => {
  const likes = await dataSource.getRepository(Like).find({
    where,
    relations: {
      user: true
    }
  });
  return likes.map((like) => ({
    ...like,
    user: {
      id: like.user.id
    }
  }));
}

export const getLike = (where: FindOptionsWhere<Like>) => {
  return dataSource.getRepository(Like).findOneBy(where);
}

interface CreateLikeArgs {
  itemId: number;
  userId: number;
}

export const createLike = ({ itemId, userId }: CreateLikeArgs) => {
  return dataSource.getRepository(Like).save({
    item: {
      id: itemId
    },
    user: {
      id: userId
    }
  });
}

export const deleteLike = async (where: FindOptionsWhere<Like>) => {
  const existingLike = await getLike(where);
  return existingLike
    ? dataSource.getRepository(Like).remove(existingLike)
    : null;
}
