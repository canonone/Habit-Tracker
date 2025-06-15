import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Task from './modules/task/entities/task.entity';
import User from './modules/user/entities/user.entity';
import UserModule from './modules/user/user.module';
import TaskModule from './modules/task/task.module';
import AuthModule from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from './config/auth.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Task, User],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig],
    }),
    UserModule,
    TaskModule,
    AuthModule,
  ],
})
export default class AppModule {}
