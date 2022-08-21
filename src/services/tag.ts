import dataSource from '../data-source';
import { Tag } from '../entities/tag';

export const resolveTagsByName = async (tagNames: string[]) => {
  return Promise.all(
    tagNames
      .reduce(
        (acc, val) => acc.includes(val) ? acc : [...acc, val],
        [] as string[]
      )
      .map((name) => saveTagIfNew(name))
  );
}

export const saveTagIfNew = async (name: string) => {
  return (await dataSource.getRepository(Tag).findOneBy({ name }))
    || dataSource.getRepository(Tag).save({ name });
}
