import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class TelegramProfile {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.telegramProfile, { cascade: true })
  @JoinColumn()
  user: User;

  @Column()
  chatId: number;

  @Column({ default: false })
  activated: boolean;

  @Column({ default: false })
  receiveUpdates: boolean;

  @Column('varchar', { array: true, default: [] })
  categoriesPreferences: string[];
}
