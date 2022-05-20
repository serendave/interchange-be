import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class Item {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => Category, { nullable: true })
  category?: Category;

  @ManyToOne(() => Category, { nullable: true })
  subcategory?: string;

  @ManyToOne(() => User, (user) => user.items)
  user?: string;

  @Column()
  name: string;

  @Column()
  description?: string;

  // @Column()
  // photos?: string[];

  @CreateDateColumn()
  dateCreated: Date;

  @Column()
  active: boolean;

  @Column('varchar', { array: true })
  tags?: string[];
}
