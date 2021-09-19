import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CrawlerService } from './crawler.service';
import { AxiosResponse } from 'axios';
import {
  IncomingWebhookResult,
  IncomingWebhookSendArguments,
} from '@slack/webhook';
import { NotifyModule } from 'src/notify/notify.module';
import { NotifyService } from 'src/notify/notify.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import slackConfig from 'src/config/slack.config';
import { SlackModule, SlackOptions } from 'nestjs-slack-webhook';

describe('CrawlerService', () => {
  let crawlerService: CrawlerService;
  let httpService: HttpService;
  let notifyService: NotifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          // ignoreEnvFile: true,
          load: [slackConfig],
        }),
        SlackModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) =>
            config.get<SlackOptions>('slack'),
        }),
      ],
      providers: [CrawlerService, NotifyService],
    }).compile();

    crawlerService = module.get<CrawlerService>(CrawlerService);
    httpService = module.get<HttpService>(HttpService);
    // notifyService = module.get<NotifyService>(NotifyService);
  });

  it('should be defined', () => {
    expect(crawlerService).toBeDefined();
  });

  describe('getHTTPRequest()', () => {
    it('should request http given url', async () => {
      // given
      const givenUrl = 'http://localhost:3000/mockUrl';

      const givenHtml = [
        `<div id="frmView"><div><div>
      <div class="btn_restock_box">Sold Out</div>
      </div></div></div>`,
      ];

      const response: AxiosResponse<any> = {
        data: givenHtml,
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl' },
        status: 200,
        statusText: 'OK',
      };

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));

      // when
      const result = await crawlerService.getHttpRequest(givenUrl);

      // then
      expect(result).not.toBeNull();
      expect(result).toEqual(givenHtml);
    });

    it('should parse Html And Check Is SoldOut', () => {
      // given
      // #frmView > div > div').has('.btn_restock_box'
      const givenHtml = `<div id="frmView">
      <div class="dum1"><div class="dum2">
      <div class="btn_restock_box">Sold Out</div></div></div></div>`;

      // when
      const result = crawlerService.parseHtmlAndCheckIsSoldOut(givenHtml);

      // then
      expect(result).toEqual(true);
    });

    it('should parse Html And Check Is SoldOut is false', () => {
      // given
      // #frmView > div > div').has('.btn_restock_box'
      const givenHtml = `<div id="frmView">
      <div class="dum1"><div class="dum2">
      <div class="btn_choice_box">구매하기</div></div></div></div>`;

      // when
      const result = crawlerService.parseHtmlAndCheckIsSoldOut(givenHtml);

      // then
      expect(result).toEqual(false);
    });

    it('should notify to slack', async () => {
      // given
      const requestNotify: IncomingWebhookSendArguments = {
        text: '(test-code) Buy It! Hurry Up!',
      };
      const resultNotify: IncomingWebhookResult = {
        text: 'ok',
      };

      // when
      const result = await crawlerService.notify(requestNotify);

      // then
      // expect(notifyService.notify).toHaveBeenCalledTimes(1);
      expect(result).toEqual(resultNotify);
    });
  });
});
