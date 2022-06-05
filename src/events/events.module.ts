import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsResository } from './repositories/event.repository';
import { AuthModule } from 'src/auth/auth.module';
import { Invite } from './entities/invite.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([EventsResository, Invite])],
  providers: [EventsResolver, EventsService],
})
export class EventsModule {}
