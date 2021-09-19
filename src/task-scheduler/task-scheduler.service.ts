import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CrawlerService } from 'src/crawler/crawler.service';

@Injectable()
export class TaskSchedulerService {
  private static readonly logger = new Logger(TaskSchedulerService.name);

  constructor(
    private readonly crawlerService: CrawlerService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS, {
    name: 'V28UE_WATCHING',
  })
  async handleWatchingStock() {
    const requestUrl =
      'https://www.jooyonshop.co.kr/goods/goods_view.php?goodsNo=1000000165';
    // TaskSchedulerService.logger.debug('아이고난!');
    const resultRequest = await this.crawlerService.getHttpRequest(requestUrl);
    const isSoldOut =
      this.crawlerService.parseHtmlAndCheckIsSoldOut(resultRequest);
    if (!isSoldOut) {
      const job = this.schedulerRegistry.getCronJob('V28UE_WATCHING');
      job.stop();
      TaskSchedulerService.logger.debug('떳따!');

      this.crawlerService.notify({ text: 'Buy It! Hurry Up!' });
    } else {
      TaskSchedulerService.logger.debug('아직 안떴따');
    }
  }
}
