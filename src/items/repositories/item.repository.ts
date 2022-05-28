import { EntityRepository, Repository } from 'typeorm';
import { GetItemsInput } from '../dto/get-items.input';
import { Item } from '../entities/item.entity';

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
  async getItems(getItemsInput?: GetItemsInput): Promise<Item[]> {
    const query = this.createQueryBuilder('item').leftJoinAndSelect(
      'item.category',
      'category',
    );

    if (getItemsInput?.user) {
      query.where('item.userId = :user', { user: getItemsInput.user });
    }

    const items = await query.getMany();
    return items;
  }
}
