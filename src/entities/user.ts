import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from './collection';
import { Comment } from './comment';
import { Like } from './like';
import { Session } from './session';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  name: string;

  @Column({
    select: false
  })
  password: string;

  @Column({
    default: false
  })
  isAdmin: boolean;

  @Column({
    default: false
  })
  isBlocked: boolean;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Collection, (collection) => collection.user)
  collections: Collection[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}
