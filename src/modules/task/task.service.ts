import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Task from './entities/task.entity';
import CreateTaskDto from './dtos/create-task.dto';
import UpdateTaskDto from './dtos/update-task.dto';
import {User} from '../user/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}

  async createTask(body: CreateTaskDto, user: User) {
    const payload = {
      ...body,
      user,
    };
    const result = this.taskRepo.create(payload);
    return await this.taskRepo.save(result);
  }

  async getOne(id: string) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('task does not exist');
    }
    return task;
  }

  async getAll() {
    const task = await this.taskRepo.find();
    if (!task) {
      throw new NotFoundException('tasks not found');
    }
    return task;
  }

  async deleteTask(id: string) {
    const task = await this.getOne(id);
    if (!task) {
      throw new NotFoundException('task does not exist');
    }
    return this.taskRepo.delete(id);
  }

  async updateTask(id: string, body: UpdateTaskDto) {
    const task = await this.taskRepo.preload({
      id,
      ...body,
    });
    if (!task) {
      throw new Error("couldn't perform this operation");
    }
    return this.taskRepo.save(task);
  }
}
