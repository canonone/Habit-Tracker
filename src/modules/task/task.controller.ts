import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import CreateTaskDto from './dtos/create-task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const user = req.user;
    return this.taskService.createTask(createTaskDto, user);
  }
}
