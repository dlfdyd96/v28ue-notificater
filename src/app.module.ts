import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlerModule } from './crawler/crawler.module';
import { NotifyModule } from './notify/notify.module';

@Module({
  imports: [CrawlerModule, NotifyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
