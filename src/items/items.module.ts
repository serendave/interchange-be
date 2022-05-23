import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemRepository } from './repositories/item.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ItemsController } from './items.controller';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ItemRepository])],
  providers: [ItemsResolver, ItemsService],
  controllers: [ItemsController],
})
export class ItemsModule {}
