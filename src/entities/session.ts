import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity('Sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;
}
