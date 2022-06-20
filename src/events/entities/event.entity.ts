import { Point } from 'geojson';
import { User } from 'src/auth/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Event extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  location: Point;

  @Column('varchar', { array: true, default: [] })
  photos: string[];

  @CreateDateColumn()
  dateCreated: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  private: boolean;

  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;

  @ManyToMany(() => User)
  @JoinTable()
  visitors: User[];
}
