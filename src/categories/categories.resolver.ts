import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryType } from './entities/category.type';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { AuthGraphQLGuard } from 'src/auth/guards';

@UseGuards(AuthGraphQLGuard)
@Resolver(() => CategoryType)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => CategoryType)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [CategoryType], { name: 'categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Query(() => CategoryType, { name: 'category' })
  findOne(@Args('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Mutation(() => CategoryType)
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoriesService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @Mutation(() => Boolean)
  removeCategory(@Args('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
