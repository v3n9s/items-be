import { Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from './collection';
import { Tag } from './tag';

@Entity('Items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Tag, (tag) => tag.items)
  tags: Tag[];

  @ManyToOne(() => Collection, (collection) => collection.items)
  collection: Collection;
}
