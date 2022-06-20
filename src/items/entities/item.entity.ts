import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class Item extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => Category, { eager: true })
  category: Category;

  @ManyToOne(() => User, (user) => user.items, { cascade: true })
  user: User;

  @Column()
  name: string;

  @Column()
  description?: string;

  @Column('varchar', { array: true, default: [] })
  photos?: string[];

  @CreateDateColumn()
  dateCreated: Date;

  @Column()
  active: boolean;

  @Column('varchar', { array: true, default: [] })
  tags?: string[];
}
