import { Column, PrimaryColumn } from 'typeorm';

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
