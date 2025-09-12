import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Put,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import CreateTaskDto from './dtos/create-task.dto';
import { AuthGuard } from '@nestjs/passport';
import UpdateTaskDto from './dtos/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const user = req.user;
    return this.taskService.createTask(createTaskDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUserTasks(@Request() req) {
    const user = req.user;
    return this.taskService.getUserTasks(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.taskService.getOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
}
