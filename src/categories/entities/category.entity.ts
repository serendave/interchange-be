import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  // @Column()
  // icon: string;
}
