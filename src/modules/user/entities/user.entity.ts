import { Entity, Column, OneToMany } from 'typeorm';
import BaseEntity from 'src/utils/base.entity';
import Task from 'src/modules/task/entities/task.entity';

@Entity()
export default class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(()=>Task, tasks=>tasks.user)
  tasks: Task[]
}
