import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item';
import { User } from './user';

@Entity('Comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  createDate: Date;

  @ManyToOne(() => Item, (item) => item.comments)
  item: Item;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;
}
