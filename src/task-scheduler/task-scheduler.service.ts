import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { request } from 'http';
import { NotFoundError } from 'rxjs';
import { WatcherService } from 'src/watcher/watcher.service';
import {
  CreateTaskRequestDto,
  CreateTaskResponseDto,
} from './dto/create-task.dto';
import { DeleteTaskResponseDto } from './dto/delete-task.dto';
import { FindAllTasksResponseDto, JobStatus } from './dto/find-all-task.dto';
import { UpdateTaskRequestDto } from './dto/update-task.dto';

@Injectable()
export class TaskSchedulerService {
  private static readonly logger = new Logger(TaskSchedulerService.name);

  constructor(
    private readonly watcherService: WatcherService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  // @Cron(CronExpression.EVERY_5_SECONDS, {
  //   name: 'V28UE_WATCHING',
  // })
  async handleWatchingStock(requestDto: CreateTaskRequestDto) {
    const { url, jsPath, name } = requestDto;
    // TaskSchedulerService.logger.debug('아이고난!');
    const resultRequest = await this.watcherService.getHttpRequest(url);
    const hasStock = this.watcherService.parseHtmlAndCheckHasStock(
      resultRequest,
      jsPath,
    );
    if (hasStock) {
      const job = this.schedulerRegistry.getCronJob(name);
      job.stop();
      TaskSchedulerService.logger.debug('떳따!');

      this.watcherService.notify({ text: `${name} Buy It! Hurry Up!` });
    } else {
      TaskSchedulerService.logger.debug('아직 안떴따');
    }
  }

  async createTask(
    requestDto: CreateTaskRequestDto,
  ): Promise<CreateTaskResponseDto> {
    // 1. create job
    const job = new CronJob(`*/5 * * * * *`, async () => {
      await this.handleWatchingStock(requestDto);
    });

    // 2. register on scheduler
    try {
      this.schedulerRegistry.addCronJob(requestDto.name, job);
      job.start();
    } catch (error) {
      TaskSchedulerService.logger.error(error);
    }
    return {
      code: 201,
      message: `${requestDto.name} cron job이 생성되고 실행되었습니다.`,
    };
    // 2.
    //
  }

  findAll(): FindAllTasksResponseDto {
    const result: JobStatus[] = [];
    this.schedulerRegistry.getCronJobs().forEach((value, key) => {
      result.push({ name: key, status: value.running });
      TaskSchedulerService.logger.debug(key + ': ' + value.running);
    });
    return { code: 200, message: `find all tasks`, jobs: result };
  }

  find(name: string) {
    try {
      const result = this.schedulerRegistry.getCronJob(name);
      TaskSchedulerService.logger.debug(name + ': ' + result.running);
      return {
        code: 200,
        message: `find '${name}' task`,
        job: { name, status: result.running },
      };
    } catch (error) {
      TaskSchedulerService.logger.error(error);
      throw error;
    }
  }

  delete(name: string): DeleteTaskResponseDto {
    try {
      this.schedulerRegistry.deleteCronJob(name);
      return {
        code: 200,
        message: `delete ${name} task`,
      };
    } catch (error) {
      TaskSchedulerService.logger.error(error);
      throw error;
    }
  }

  update(name: string, body: UpdateTaskRequestDto) {
    const { start } = body;
    try {
      const selectedJob = this.schedulerRegistry.getCronJob(name);
      if (start) selectedJob.start();
      else selectedJob.stop();
      TaskSchedulerService.logger.debug(name + ': ' + selectedJob.running);
      return {
        code: 200,
        message: `find '${name}' task`,
        job: { name, status: selectedJob.running },
      };
    } catch (error) {
      TaskSchedulerService.logger.error(error);
      throw error;
    }
  }
}
