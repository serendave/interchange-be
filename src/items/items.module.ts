import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([ItemRepository])],
  providers: [ItemsResolver, ItemsService],
})
export class ItemsModule {}
