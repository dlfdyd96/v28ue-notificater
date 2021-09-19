import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SlackModule } from 'nestjs-slack-webhook';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import slackConfig from './config/slack.config';
import { CrawlerModule } from './crawler/crawler.module';
import { NotifyModule } from './notify/notify.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      load: [slackConfig],
    }),
    CrawlerModule,
    NotifyModule,
    SlackModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config) => config.get('slack'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
