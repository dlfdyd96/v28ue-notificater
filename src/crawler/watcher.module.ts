import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NotifyModule } from 'src/notify/notify.module';
import { WatcherService } from './watcher.service';

@Module({
  imports: [HttpModule, NotifyModule],
  providers: [WatcherService],
  exports: [WatcherService],
})
export class WatcherModule {}
