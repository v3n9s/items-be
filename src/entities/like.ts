import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item';
import { User } from './user';

@Entity('Likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, (item) => item.likes)
  item: Item;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;
}
