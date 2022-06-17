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

    if (getItemsInput?.selectUser) {
      query.leftJoinAndSelect('item.user', 'user');
    }

    if (getItemsInput?.user) {
      query.where('item.userId = :user', { user: getItemsInput.user });
    }

    if (getItemsInput?.search) {
      query.where('item.name LIKE :name', {
        name: `%${getItemsInput.search}%`,
      });
    }

    if (getItemsInput?.category) {
      query.andWhere('item.categoryId = :category', {
        category: getItemsInput.category,
      });
    }

    if (getItemsInput?.sortBy) {
      query.orderBy(`item.${getItemsInput.sortBy}`);
    }

    if (getItemsInput?.range && getItemsInput?.location) {
      const origin = {
        type: 'Point',
        coordinates: [
          getItemsInput.location.longitude,
          getItemsInput.location.latitude,
        ],
      };

      query.where(
        'ST_DWithin(user.location, ST_SetSRID(ST_GeoFromGeoJSON(:origin), ST_SRID(user.location)), :range)',
        { origin, range: getItemsInput.range * 1000 },
      );
    }

    const items = await query.getMany();
    return items;
  }
}
