import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SlackModule, SlackOptions } from 'nestjs-slack-webhook';
import slackConfig from '../config/slack.config';
import { NotifyService } from './notify.service';

describe('NotifyService', () => {
  let service: NotifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
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
      providers: [NotifyService],
    }).compile();

    service = module.get<NotifyService>(NotifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
