import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Point } from 'geojson';
import { Item } from 'src/items/entities/item.entity';
import { TelegramProfile } from 'src/telegram/entities/telegram-profile.entity';
import { Invite } from 'src/events/entities/invite.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  rating: number;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

  @Column({ nullable: true })
  photo: string;

  @CreateDateColumn()
  dateJoined: Date;

  @OneToMany(() => Item, (item) => item.user, { nullable: true })
  items: Item[];

  @OneToOne(() => TelegramProfile, { nullable: true })
  telegramProfile: TelegramProfile;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Invite, (invite) => invite.user)
  invitations: Invite[];
}
