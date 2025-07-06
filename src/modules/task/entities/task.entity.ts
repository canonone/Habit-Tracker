import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import BaseEntity from 'src/utils/base.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity()
export default class Task extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'boolean', default: false })
  isDone: boolean;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
