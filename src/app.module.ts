import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Task from './modules/task/entities/task.entity';
import User from './modules/user/entities/user.entity';
import UserModule from './modules/user/user.module';
import TaskModule from './modules/task/task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Task, User],
      synchronize: true,
    }),
    UserModule,
    TaskModule,
  ],
})
export default class AppModule {}
