import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item';

@Entity('Tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Item, (item) => item.tags)
  items: Item[];
}
