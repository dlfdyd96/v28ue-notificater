import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
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
}
