import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Collection } from './collection';
import { Tag } from './tag';

@Entity('Items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Tag, (tag) => tag.items)
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => Collection, (collection) => collection.items)
  collection: Collection;
}
