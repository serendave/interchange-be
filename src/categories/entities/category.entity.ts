import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  // @Column()
  // parentId: string;

  // @Column()
  // icon: string;
}
