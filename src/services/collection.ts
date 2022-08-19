import dataSource from '../data-source';
import { Collection } from '../entities/collection';
import { User } from '../entities/user';

export const getCollections = (userId: number) => {
  return dataSource.getRepository(Collection).findBy({
    user: { id: userId }
  });
}

export const getCollection = (id: number) => {
  return dataSource.getRepository(Collection).findOneBy({ id });
}

export const createCollection = async (
  { userId, ...collection}: Pick<Collection, 'name' | 'description'> & { userId: number }
) => {
  if (!(await dataSource.getRepository(User).findOneBy({ id: userId }))) {
    return null;
  }
  return dataSource.getRepository(Collection).save({
    ...collection,
    user: { id: userId }
  });
}

export const deleteCollection = async (id: number) => {
  const collection = await getCollection(id);
  return collection
    ? !!(await dataSource.getRepository(Collection).remove(collection))
    : null;
}

export const updateCollection = async (
  collection: Partial<Pick<Collection, 'name' | 'description'>> & Pick<Collection, 'id'>
) => {
  return (await isCollectionExists(collection.id))
    ? dataSource.getRepository(Collection).save(collection)
    : null;
}

export const isCollectionBelongsToUser = async (collectionId: number, userId: number) => {
  return !!(await dataSource.getRepository(Collection).findOneBy({
    id: collectionId,
    user: {
      id: userId
    }
  }));
}

export const isCollectionExists = async (id: number) => {
  return !!(await dataSource.getRepository(Collection).findOneBy({ id }));
}
