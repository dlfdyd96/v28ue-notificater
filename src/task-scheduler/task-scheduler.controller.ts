import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TaskSchedulerService } from './task-scheduler.service';

@Controller('task')
export class TaskSchedulerController {
  private static readonly logger = new Logger(TaskSchedulerController.name);

  constructor(private readonly taskSchedulerService: TaskSchedulerService) {}

  @Post('')
  createTask() {
    TaskSchedulerController.logger.debug('create Task');
  }

  @Get('')
  findAllTasks() {
    TaskSchedulerController.logger.debug('find all tasks');
  }

  @Get(':id')
  findOneTask(@Param('id') id: string) {
    TaskSchedulerController.logger.debug(`find one task : ${id}`);
  }

  @Put(':id')
  updateTask(@Param('id') id: string) {
    TaskSchedulerController.logger.debug(`update task : ${id}`);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    TaskSchedulerController.logger.debug(`delete task : ${id}`);
  }
}
