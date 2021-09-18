import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CrawlerService } from './crawler.service';
import { AxiosResponse } from 'axios';

describe('CrawlerService', () => {
  let crawlerService: CrawlerService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [CrawlerService],
    }).compile();

    crawlerService = module.get<CrawlerService>(CrawlerService);
    httpService = module.get<HttpService>(HttpService);
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

    it.todo('should check Sold Out');
    it.todo('Notify to SlackNotifer');
  });
});
