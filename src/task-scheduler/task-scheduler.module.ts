import { Module } from '@nestjs/common';
import { WatcherModule } from 'src/crawler/watcher.module';
import { TaskSchedulerService } from './task-scheduler.service';
import { TaskSchedulerController } from './task-scheduler.controller';

@Module({
  imports: [WatcherModule],
  providers: [TaskSchedulerService],
  controllers: [TaskSchedulerController],
})
export class TaskSchedulerModule {}
