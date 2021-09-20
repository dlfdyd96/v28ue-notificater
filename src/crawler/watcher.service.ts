import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { IncomingWebhookSendArguments } from '@slack/client';
import { load } from 'cheerio';
import { firstValueFrom, map } from 'rxjs';
import { NotifyService } from 'src/notify/notify.service';

@Injectable()
export class WatcherService {
  private static readonly logger = new Logger(WatcherService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly notifyService: NotifyService,
  ) {}

  async getHttpRequest(givenUrl: string) {
    const result = await firstValueFrom(
      this.httpService.get(givenUrl).pipe(map((response) => response.data)),
    );
    // CrawlerService.logger.log(result);
    return result;
  }

  parseHtmlAndCheckIsSoldOut(givenHtml: string) {
    const $ = load(givenHtml);
    const result = $('#frmView > div > div').children('.btn_restock_box').text()
      ? true
      : false;
    return result;
    // CrawlerService.logger.log(result);
    // return result.length === 0 ? true : false; // sold out = true
  }

  async notify(requestNotifyToSlack: IncomingWebhookSendArguments) {
    return await this.notifyService.notify(requestNotifyToSlack);
  }
}
