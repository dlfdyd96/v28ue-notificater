import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SlackModule } from 'nestjs-slack-webhook';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import slackConfig from './config/slack.config';
import { CrawlerModule } from './crawler/crawler.module';
import { NotifyModule } from './notify/notify.module';
import { TaskSchedulerModule } from './task-scheduler/task-scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [slackConfig],
    }),
    CrawlerModule,
    NotifyModule,
    SlackModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config) => config.get('slack'),
    }),
    ScheduleModule.forRoot(),
    TaskSchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
