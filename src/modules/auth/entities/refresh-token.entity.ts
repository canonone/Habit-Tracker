import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column()
  expireDate: Date;

  @ManyToOne(() => User, (user) => user.refreshToken)
  user: User;
}
