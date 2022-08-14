import { DataSource } from 'typeorm';
import config from './config';
import { Collection } from './entities/collection';
import { Comment } from './entities/comment';
import { Item } from './entities/item';
import { Like } from './entities/like';
import { Session } from './entities/session';
import { Tag } from './entities/tag';
import { User } from './entities/user';

export default new DataSource({
  type: 'postgres',
  url: config.DATABASE_URL,
  entities: [User, Session, Comment, Collection, Item, Like, Tag]
});
