import { Injectable } from '@nestjs/common';
import {
  IncomingWebhook,
  IncomingWebhookResult,
  IncomingWebhookSendArguments,
} from '@slack/client';
import { InjectSlack } from 'nestjs-slack-webhook';

@Injectable()
export class NotifyService {
  constructor(
    @InjectSlack()
    private readonly slack: IncomingWebhook,
  ) {}

  async notify(
    args: IncomingWebhookSendArguments,
  ): Promise<IncomingWebhookResult> {
    return await this.slack.send(args);
  }
}
