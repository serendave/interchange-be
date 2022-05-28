import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  // @Column()
  // icon: string;
}
