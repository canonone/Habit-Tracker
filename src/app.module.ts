import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import Task from './modules/task/entities/task.entity';
// import { User } from './modules/user/entities/user.entity';
import UserModule from './modules/user/user.module';
import TaskModule from './modules/task/task.module';
import AuthModule from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from './config/auth.config';
import { ConfigService } from '@nestjs/config';
import dataSource from './database/data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSource.options,
      }),
      dataSourceFactory: async () => {
        if (!dataSource.isInitialized) {
          await dataSource.initialize();
        }
        return dataSource;
      },
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
