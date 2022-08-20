import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item';

@Entity('Tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  name: string;

  @ManyToMany(() => Item, (item) => item.tags)
  items: Item[];
}
