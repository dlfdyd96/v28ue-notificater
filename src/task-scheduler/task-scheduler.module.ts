import { Module } from '@nestjs/common';
import { WatcherModule } from 'src/crawler/watcher.module';
import { TaskSchedulerService } from './task-scheduler.service';

@Module({
  imports: [WatcherModule],
  providers: [TaskSchedulerService],
})
export class TaskSchedulerModule {}
