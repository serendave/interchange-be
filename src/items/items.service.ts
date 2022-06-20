import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from './entities/item.entity';
import { ItemRepository } from './repositories/item.repository';
import { v4 as uuid } from 'uuid';
import { User } from 'src/auth/entities/user.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { GetItemsInput } from './dto/get-items.input';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemRepository) private itemRepository: ItemRepository,
    private categoriesService: CategoriesService,
    private telegramService: TelegramService,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const category = await this.categoriesService.findOne(
      createItemInput.categoryId,
    );

    const item = this.itemRepository.create({
      id: uuid(),
      user: user,
      active: true,
      category,
      ...createItemInput,
    });

    await this.itemRepository.save(item);
    this.telegramService.notifyUsersWithNewItem(item);

    return item;
  }

  async findAll(getItemsInput: GetItemsInput): Promise<Item[]> {
    return this.itemRepository.getItems(getItemsInput);
  }

  async findOne(id: string): Promise<Item> {
    const found = await this.itemRepository.findOne(id, {
      relations: ['user'],
    });

    if (!found) {
      throw new NotFoundException('Item with such id not found');
    }

    return found;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    let task = await this.findOne(id);

    delete updateItemInput.id;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    task = { ...task, ...updateItemInput };
    await this.itemRepository.save(task);

    return task;
  }

  async remove(id: string): Promise<boolean> {
    const task = await this.findOne(id);
    await this.itemRepository.remove(task);

    return true;
  }

  async processItemImages(itemId: string, images: string[]): Promise<boolean> {
    const item = await this.findOne(itemId);

    item.photos = [...item.photos, ...images];
    await this.itemRepository.save(item);

    return true;
  }
}
