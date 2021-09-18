import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { CrawlerService } from './crawler.service';

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
      const givenUrl = 'https://www.google.com';

      // when
      const result = await crawlerService.getHttpRequest(givenUrl);

      // then
      expect(result).not.toBeNull();
    });

    it('should parse HTML', async () => {
      // given
      const givenUrl = 'https://www.google.com';
      const givenHtmlString = await crawlerService.getHttpRequest(givenUrl);

      // when
      const result = await crawlerService.parseHtml(givenHtmlString);

      // then
      expect(result).not.toBeNull();
    });

    it.todo('should check Sold Out');
    it.todo('Notify to SlackNotifer');
  });
});
