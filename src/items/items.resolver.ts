import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { ItemType } from './entities/item.type';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';

@Resolver(() => ItemType)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => ItemType)
  createItem(@Args('createItemInput') createItemInput: CreateItemInput) {
    return this.itemsService.create(createItemInput);
  }

  @Query(() => [ItemType], { name: 'items' })
  findAll() {
    return this.itemsService.findAll();
  }

  @Query(() => ItemType, { name: 'item' })
  findOne(@Args('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => ItemType)
  updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput) {
    return this.itemsService.update(updateItemInput.id, updateItemInput);
  }

  @Mutation(() => Boolean)
  removeItem(@Args('id') id: string) {
    return this.itemsService.remove(id);
  }
}
