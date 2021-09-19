import { Module } from '@nestjs/common';
import { CrawlerModule } from 'src/crawler/crawler.module';
import { TaskSchedulerService } from './task-scheduler.service';

@Module({
  imports: [CrawlerModule],
  providers: [TaskSchedulerService],
})
export class TaskSchedulerModule {}
