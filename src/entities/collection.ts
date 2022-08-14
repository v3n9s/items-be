import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item';
import { User } from './user';

@Entity('Collections')
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.collections)
  user: User;

  @OneToMany(() => Item, (item) => item.collection)
  items: Item[];
}
