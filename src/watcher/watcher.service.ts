import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { IncomingWebhookSendArguments } from '@slack/client';
import { throws } from 'assert';
import { load } from 'cheerio';
import { catchError, firstValueFrom, map } from 'rxjs';
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
      this.httpService.get(givenUrl).pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new BadRequestException(error);
        }),
      ),
    );
    return result;
  }

  parseHtmlAndCheckHasStock(resultRequest: string, jsPath: string) {
    const $ = load(resultRequest);
    const result = $(jsPath).text() ? true : false;
    return result;
    // CrawlerService.logger.log(result);
    // return result.length === 0 ? true : false; // sold out = true
  }

  async notify(requestNotifyToSlack: IncomingWebhookSendArguments) {
    return await this.notifyService.notify(requestNotifyToSlack);
  }
}
