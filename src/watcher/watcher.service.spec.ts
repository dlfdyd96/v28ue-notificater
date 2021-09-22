import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { WatcherService } from './watcher.service';
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

const mockNotifyService = {
  notify: jest.fn(),
};

describe('WatcherService', () => {
  let watcherService: WatcherService;
  let httpService: HttpService;
  let notifyService: NotifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        WatcherService,
        { provide: NotifyService, useValue: mockNotifyService },
      ],
    }).compile();

    watcherService = module.get<WatcherService>(WatcherService);
    httpService = module.get<HttpService>(HttpService);
    notifyService = module.get<NotifyService>(NotifyService);
  });

  it('should be defined', () => {
    expect(watcherService).toBeDefined();
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
      const result = await watcherService.getHttpRequest(givenUrl);

      // then
      expect(result).not.toBeNull();
      expect(result).toEqual(givenHtml);
    });
  });

  describe('parseHtmlAndCheckIsSoldOut()', () => {
    it('should parse Html And Check Is SoldOut', () => {
      // given
      // #frmView > div > div').has('.btn_restock_box'
      const givenHtml = `<div id="frmView">
      <div class="dum1"><div class="dum2">
      <div class="btn_restock_box">Sold Out</div></div></div></div>`;

      // when
      const result = watcherService.parseHtmlAndCheckIsSoldOut(givenHtml);

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
      const result = watcherService.parseHtmlAndCheckIsSoldOut(givenHtml);

      // then
      expect(result).toEqual(false);
    });
  });

  describe('notify()', () => {
    it('should notify to slack', async () => {
      // given
      const requestNotify: IncomingWebhookSendArguments = {
        text: '(test-code) Buy It! Hurry Up!',
      };
      const resultNotify: IncomingWebhookResult = {
        text: 'ok',
      };
      jest
        .spyOn(notifyService, 'notify')
        .mockImplementation(
          async (arg: IncomingWebhookSendArguments) => resultNotify,
        );

      // when
      const result = await watcherService.notify(requestNotify);

      // then
      // expect(notifyService.notify).toHaveBeenCalledTimes(1);
      expect(result).toEqual(resultNotify);

      expect(notifyService.notify).toHaveBeenCalledTimes(1);
      expect(notifyService.notify).toHaveBeenCalledWith(requestNotify);
    });
  });
});
