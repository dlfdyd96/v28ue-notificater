import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { load } from 'cheerio';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class CrawlerService {
  private static readonly logger = new Logger(CrawlerService.name);

  constructor(private httpService: HttpService) {}

  async getHttpRequest(givenUrl: string) {
    const result = await firstValueFrom(
      this.httpService.get(givenUrl).pipe(map((response) => response.data)),
    );
    CrawlerService.logger.log(result);
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
}
