import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Context, Telegraf } from 'telegraf';
import { CallbackQuery, Update, Message } from 'typegram';
import { TelegramWelcomeMessage } from 'src/constants';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { TelegramProfile } from './entities/telegram-profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { Item } from 'src/items/entities/item.entity';

const ELEMENTS_PER_ROW = 2;
const SEARCH_RADIUS_VALUE = 200;

@Injectable()
export class TelegramService {
  private readonly bot: Telegraf<Context<Update>>;

  constructor(
    configService: ConfigService,
    private authService: AuthService,
    private categoriesService: CategoriesService,
    @InjectRepository(TelegramProfile)
    private telegramProfileRepository: Repository<TelegramProfile>,
  ) {
    this.bot = new Telegraf(configService.get('TELEGRAM_BOT_TOKEN'));

    this.bot.command('quit', (ctx) => ctx.leaveChat());

    if (!this.bot.telegram.webhookReply) {
      this.bot.telegram.setWebhook(configService.get('TELEGRAM_WEBHOOK_URL'));
    }
  }

  async processMessage(message: Message.TextMessage): Promise<boolean> {
    if (message?.text === '/start') {
      this.bot.telegram.sendMessage(message.chat.id, TelegramWelcomeMessage);
    } else if (message?.text?.includes('/signin')) {
      this.processLogin(message);
    } else if (message.text === '/categories') {
      this.processCategories(message);
    } else if (message.text === '/clear') {
      this.clearCategories(message);
    } else if (message.text === '/stop_updates') {
      this.stopUpdates(message);
    } else if (message.text === '/continue_updates') {
      this.continueUpdates(message);
    } else if (message.text === '/signout') {
      this.signOut(message);
    }

    return true;
  }

  private async processLogin(message: Message.TextMessage) {
    const telegramProfile = await this.telegramProfileRepository.findOne({
      chatId: message.chat.id,
    });

    if (telegramProfile) {
      telegramProfile.activated = true;
      await this.telegramProfileRepository.save(telegramProfile);

      return this.bot.telegram.sendMessage(
        message.chat.id,
        'You have succesfully authenticated! Now type /categories to select categories you would like to receive updates on',
      );
    }

    if (message.text.match(/^\/signin .+ .+$/)) {
      let user: User;
      const [_, email, password] = message.text.split(' ');

      try {
        user = await this.authService.signInWithTelegram({
          email,
          password,
        });
      } catch (e) {
        return this.bot.telegram.sendMessage(
          message.chat.id,
          "Sorry, we couldn't find user with such credentials",
        );
      }

      const telegramProfile = this.telegramProfileRepository.create({
        id: uuid(),
        user,
        chatId: message.chat.id,
        activated: true,
        receiveUpdates: true,
        categoriesPreferences: [],
      });

      await this.telegramProfileRepository.save(telegramProfile);

      this.bot.telegram.sendMessage(
        message.chat.id,
        'You have succesfully authenticated! Now type /categories to select categories you would like to receive updates on',
      );
    } else {
      this.bot.telegram.sendMessage(
        message.chat.id,
        'Ops! Wrong format. It should be: /signin [email] [password]',
      );
    }
  }

  private async processCategories(message: Message.TextMessage) {
    const categories = await this.categoriesService.findAll();
    const categoriesRows: Category[][] = [];

    for (let i = 0; i < categories.length; i += ELEMENTS_PER_ROW) {
      categoriesRows.push(categories.slice(i, i + ELEMENTS_PER_ROW));
    }

    return this.bot.telegram.sendMessage(
      message.chat.id,
      `Please select the categories which you would like to receive updates on`,
      {
        reply_markup: {
          inline_keyboard: categoriesRows.map((categoryRow) => {
            return categoryRow.map((category) => ({
              text: category.name,
              callback_data: `${category.id}:${category.name}`,
            }));
          }),
        },
      },
    );
  }

  async processCallbackQuery(callbackQuery: CallbackQuery) {
    const telegramProfile = await this.findTelegramProfile(
      callbackQuery.message.chat.id,
    );

    const [categoryId, categoryName] = callbackQuery.data.split(':');

    if (!telegramProfile.categoriesPreferences.includes(categoryId)) {
      telegramProfile.categoriesPreferences.push(categoryId);
      await this.telegramProfileRepository.save(telegramProfile);

      this.bot.telegram.answerCbQuery(
        callbackQuery.id,
        `You have successfully subscribed to ${categoryName} category!`,
      );
    } else {
      this.bot.telegram.answerCbQuery(
        callbackQuery.id,
        `You are already subscribed to ${categoryName} category.`,
      );
    }
  }

  async clearCategories(message: Message.TextMessage) {
    const telegramProfile = await this.findTelegramProfile(message.chat.id);

    telegramProfile.categoriesPreferences = [];
    await this.telegramProfileRepository.save(telegramProfile);

    this.bot.telegram.sendMessage(
      message.chat.id,
      'You have successfully cleared your preferences.',
    );
  }

  async stopUpdates(message: Message.TextMessage) {
    const telegramProfile = await this.findTelegramProfile(message.chat.id);

    telegramProfile.receiveUpdates = false;
    await this.telegramProfileRepository.save(telegramProfile);

    this.bot.telegram.sendMessage(
      message.chat.id,
      'You have stopped receiving updates.',
    );
  }

  async continueUpdates(message: Message.TextMessage) {
    const telegramProfile = await this.findTelegramProfile(message.chat.id);

    telegramProfile.receiveUpdates = true;
    await this.telegramProfileRepository.save(telegramProfile);

    this.bot.telegram.sendMessage(
      message.chat.id,
      'You have continued receiving updates.',
    );
  }

  async signOut(message: Message.TextMessage) {
    const telegramProfile = await this.findTelegramProfile(message.chat.id);

    telegramProfile.activated = false;
    await this.telegramProfileRepository.save(telegramProfile);

    this.bot.telegram.sendMessage(
      message.chat.id,
      'You have signed out of the bot.',
    );
  }

  async findTelegramProfile(chatId: number): Promise<TelegramProfile | null> {
    const telegramProfile = await this.telegramProfileRepository.findOne({
      chatId,
    });

    if (!telegramProfile) {
      this.bot.telegram.sendMessage(
        chatId,
        "Sorry, we couldn't find your profile. Have you authenticated via /signin command before?",
      );

      return null;
    }

    return telegramProfile;
  }

  async notifyUsersWithNewItem(item: Item) {
    const findProfilesQuery = this.telegramProfileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where(
        'profile.categoriesPreferences @> ARRAY[:categories]::character varying[]',
        { categories: item.category.id },
      )
      .where(
        'ST_DWithin(user.location, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326), :radius)',
        {
          radius: SEARCH_RADIUS_VALUE * 1000,
          lng: item.user.location.coordinates[0],
          lat: item.user.location.coordinates[1],
        },
      );

    const relatedProfiles = await findProfilesQuery.getMany();

    relatedProfiles.forEach((profile) => {
      this.bot.telegram.sendMessage(
        profile.chatId,
        `A new item ${item.name} in category: "${item.category.name}", that matches your preferences has been posted. Go to the app to view it`,
      );
    });

    return true;
  }
}
