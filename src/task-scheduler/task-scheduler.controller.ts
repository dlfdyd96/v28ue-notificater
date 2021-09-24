import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CreateTaskRequestDto,
  CreateTaskResponseDto,
} from './dto/create-task.dto';
import { DeleteTaskResponseDto } from './dto/delete-task.dto';
import { FindAllTasksResponseDto } from './dto/find-all-task.dto';
import { UpdateTaskRequestDto } from './dto/update-task.dto';
import { TaskSchedulerService } from './task-scheduler.service';

@Controller('task')
export class TaskSchedulerController {
  private static readonly logger = new Logger(TaskSchedulerController.name);

  constructor(private readonly taskSchedulerService: TaskSchedulerService) {}

  @Post()
  @ApiOperation({
    summary: '테스크 생성 API',
    description: '테스크를 생성한다.',
  })
  @ApiCreatedResponse({ description: '성공', type: CreateTaskResponseDto })
  async createTask(@Body() requestDto: CreateTaskRequestDto) {
    TaskSchedulerController.logger.debug('create Task');
    return await this.taskSchedulerService.createTask(requestDto);
  }

  @Get()
  @ApiResponse({
    description: `모든 테스트 조회`,
    type: FindAllTasksResponseDto,
  })
  findAllTasks() {
    TaskSchedulerController.logger.debug('find all tasks');
    return this.taskSchedulerService.findAll();
  }

  @Get(':name')
  findOneTask(@Param('name') name: string) {
    TaskSchedulerController.logger.debug(`find one task : ${name}`);
    return this.taskSchedulerService.find(name);
  }

  @Put(':name')
  updateTask(@Param('name') name: string, @Body() body: UpdateTaskRequestDto) {
    TaskSchedulerController.logger.debug(`update task : ${name}`);
    return this.taskSchedulerService.update(name, body);
  }

  @Delete(':name')
  deleteTask(@Param('name') name: string): DeleteTaskResponseDto {
    TaskSchedulerController.logger.debug(`delete task : ${name}`);
    return this.taskSchedulerService.delete(name);
  }
}
