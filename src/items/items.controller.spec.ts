import { Test } from '@nestjs/testing';
import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';
import items from '../mocks/items';

describe('ItemsResolver', () => {
  let itemsResolver: ItemsResolver;
  let itemsService: ItemsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ItemsResolver, ItemsService],
    }).compile();

    itemsService = moduleRef.get<ItemsService>(ItemsService);
    itemsResolver = moduleRef.get<ItemsResolver>(ItemsResolver);
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      jest.spyOn(itemsService, 'findAll').mockImplementation(async () => items);
      expect(await itemsResolver.findAll()).toBe(items);
    });
  });
});
