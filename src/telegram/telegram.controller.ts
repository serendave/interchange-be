import { Body, Controller, Post } from '@nestjs/common';

import { Message, CallbackQuery } from 'typegram';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private telegramService: TelegramService) {}

  @Post('/')
  receiveWebhook(
    @Body('message') message?: Message.TextMessage,
    @Body('callback_query') callbackQuery?: CallbackQuery,
  ) {
    if (message) {
      this.telegramService.processMessage(message);
    } else if (callbackQuery) {
      this.telegramService.processCallbackQuery(callbackQuery);
    }

    return true;
  }
}
