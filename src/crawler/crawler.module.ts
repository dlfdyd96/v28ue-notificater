import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NotifyModule } from 'src/notify/notify.module';
import { CrawlerService } from './crawler.service';

@Module({
  imports: [HttpModule, NotifyModule],
  providers: [CrawlerService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
