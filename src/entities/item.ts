import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Collection } from './collection';
import { Comment } from './comment';
import { Like } from './like';
import { Tag } from './tag';

@Entity('Items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Comment, (comment) => comment.item)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.item)
  likes: Like[];

  @ManyToMany(() => Tag, (tag) => tag.items)
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => Collection, (collection) => collection.items)
  collection: Collection;
}
