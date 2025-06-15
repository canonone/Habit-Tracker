import { Module } from '@nestjs/common';
import Task from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TaskService],
})
export default class TaskModule {}
