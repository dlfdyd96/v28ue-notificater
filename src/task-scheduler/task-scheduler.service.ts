import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { WatcherService } from 'src/crawler/watcher.service';

@Injectable()
export class TaskSchedulerService {
  private static readonly logger = new Logger(TaskSchedulerService.name);

  constructor(
    private readonly watcherService: WatcherService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS, {
    name: 'V28UE_WATCHING',
  })
  async handleWatchingStock() {
    const requestUrl =
      'https://www.jooyonshop.co.kr/goods/goods_view.php?goodsNo=1000000165';
    // TaskSchedulerService.logger.debug('아이고난!');
    const resultRequest = await this.watcherService.getHttpRequest(requestUrl);
    const isSoldOut =
      this.watcherService.parseHtmlAndCheckIsSoldOut(resultRequest);
    if (!isSoldOut) {
      const job = this.schedulerRegistry.getCronJob('V28UE_WATCHING');
      job.stop();
      TaskSchedulerService.logger.debug('떳따!');

      this.watcherService.notify({ text: 'Buy It! Hurry Up!' });
    } else {
      TaskSchedulerService.logger.debug('아직 안떴따');
    }
  }
}
