import { Point } from 'geojson';
import { User } from 'src/auth/entities/user.entity';
import {
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
export class Event {
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

  @Column({ nullable: true })
  photo: string;

  @CreateDateColumn()
  dateCreated: Date;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;

  @ManyToMany(() => User)
  @JoinTable()
  visitors: User[];
}
