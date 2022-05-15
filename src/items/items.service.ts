import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from './entities/item.entity';
import { ItemRepository } from './repositories';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemRepository) private itemRepository: ItemRepository,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const item = this.itemRepository.create({
      id: uuid(),
      active: true,
      ...createItemInput,
    });

    await this.itemRepository.save(item);
    return item;
  }

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async findOne(id: string): Promise<Item> {
    const found = await this.itemRepository.findOne(id);

    if (!found) {
      throw new NotFoundException('Item with such id not found');
    }

    return found;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    let task = await this.findOne(id);

    delete updateItemInput.id;

    task = { ...task, ...updateItemInput };
    await this.itemRepository.save(task);

    return task;
  }

  async remove(id: string): Promise<boolean> {
    const task = await this.findOne(id);
    await this.itemRepository.remove(task);

    return true;
  }
}
