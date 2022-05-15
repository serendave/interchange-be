import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './entities/category.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryInput: CreateCategoryInput) {
    const category = this.categoriesRepository.create({
      id: uuid(),
      ...createCategoryInput,
    });

    await this.categoriesRepository.save(category);
    return category;
  }

  async findAll() {
    return this.categoriesRepository.find();
  }

  async findOne(id: string) {
    const found = await this.categoriesRepository.findOne(id);

    if (!found) {
      throw new NotFoundException('Item with such id not found');
    }

    return found;
  }

  async update(id: string, updateCategoryInput: UpdateCategoryInput) {
    let category = await this.findOne(id);

    delete updateCategoryInput.id;

    category = { ...category, ...updateCategoryInput };
    await this.categoriesRepository.save(category);

    return category;
  }

  async remove(id: string): Promise<boolean> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);

    return true;
  }
}
