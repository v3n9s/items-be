import { FindManyOptions, In } from 'typeorm';
import dataSource from '../data-source';
import { Item } from '../entities/item';
import { resolveTagsByName } from './tag';

interface GetItemsArgs {
  sortBy: string;
  sortOrder: string;
  itemsPerPage: number;
  page: number | null;
  collectionId: number | null;
}

export const getItems = ({
  sortBy = 'id',
  sortOrder = 'asc',
  itemsPerPage = 0,
  page = null,
  collectionId = null
}: Partial<GetItemsArgs>) => {
  const options: FindManyOptions<Item> = {
    order: {
      [sortBy]: sortOrder
    }
  };
  if (collectionId) {
    options.where = {
      collection: {
        id: collectionId
      }
    };
  }
  if (itemsPerPage) {
    options.take = itemsPerPage;
    if (page) {
      options.skip = itemsPerPage * page;
    }
  }
  return dataSource.getRepository(Item).find(options)
    .catch((reason: Error) => reason);
}

export const getItem = (id: number) => {
  return dataSource.getRepository(Item).findOne({
    where: { id },
    relations: {
      tags: true
    }
  });
}

interface CreateItemArgs {
  name: string;
  tagNames: string[];
  collectionId: number;
}

export const createItem = async ({
  name,
  tagNames,
  collectionId
}: CreateItemArgs) => {
  const tags = await resolveTagsByName(tagNames);
  return dataSource.getRepository(Item).save({
    name,
    tags,
    collection: { id: collectionId }
  });
}

interface UpdateItemArgs {
  id: number;
  name?: string;
  tagNames?: string[];
}

export const updateItem = async ({
  id,
  name,
  tagNames
}: UpdateItemArgs) => {
  const existingItem = await getItem(id);
  if (!existingItem) return null;
  const newTags = tagNames
    ? await resolveTagsByName(tagNames)
    : existingItem.tags;
  const newName = name || existingItem.name;
  return dataSource.getRepository(Item).save({
    id,
    name: newName,
    tags: newTags
  });
}

export const deleteItem = async (id: number) => {
  const item = await getItem(id);
  return item
    ? !!(await dataSource.getRepository(Item).remove(item))
    : null;
}

export const isItemBelongsToUser = async (itemId: number, userId: number) => {
  return !!(await dataSource.getRepository(Item).findOneBy({
    id: itemId,
    collection: {
      user: {
        id: userId
      }
    }
  }));
}
