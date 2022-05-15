import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryColumn('uuid')
  id: string;

  // TODO: convert to foreign key
  // @Column()
  // categoryId?: string;

  // TODO: convert to foreign key
  // @Column()
  // subcategoryId?: string;

  // TODO: convert to foreign key
  // @Column()
  // userId?: string;

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
