import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import {
  CreateEventInput,
  CreateInviteInput,
  UpdateEventInput,
  JoinEventInput,
  GetEventsInput,
  GetInvitesInput,
} from './dto';
import { EventsResository } from './repositories/event.repository';
import { Event } from './entities/event.entity';
import { User } from 'src/auth/entities/user.entity';
import { convertLocationToPoint } from 'src/utils';
import { AuthService } from 'src/auth/auth.service';
import { Invite } from './entities/invite.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventsResository)
    private eventsRepository: EventsResository,
    @InjectRepository(Invite)
    private inviteRepository: Repository<Invite>,
    private authService: AuthService,
  ) {}

  async create(user: User, createEventInput: CreateEventInput): Promise<Event> {
    const event = this.eventsRepository.create({
      id: uuid(),
      ...createEventInput,
      creator: user,
      visitors: [user],
      location: convertLocationToPoint(createEventInput.location),
    });

    await this.eventsRepository.save(event);

    return event;
  }

  async findAll(getEventsInput?: GetEventsInput): Promise<Event[]> {
    return this.eventsRepository.getEvents(getEventsInput);
  }

  async findInvites(getInvitesInput: GetInvitesInput): Promise<Invite[]> {
    const user = await this.authService.findOne(getInvitesInput.userId);

    return this.inviteRepository.find({ user });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne(id, {
      relations: ['creator', 'visitors'],
    });

    if (!event) {
      throw new NotFoundException('No event with such id was found');
    }

    return event;
  }

  async joinEvent(joinEventInput: JoinEventInput): Promise<Event> {
    const { userId, eventId } = joinEventInput;

    const event = await this.findOne(eventId);

    if (event.visitors.some((visitor) => visitor.id === userId)) {
      throw new BadRequestException(
        'This user is already participant of this event',
      );
    }

    const user = await this.authService.findOne(userId);

    event.visitors = [...event.visitors, user];
    await this.eventsRepository.save(event);

    const invite = await this.inviteRepository.find({ event, user });
    await this.inviteRepository.remove(invite);

    return event;
  }

  async createInvite(createInviteInput: CreateInviteInput): Promise<Invite> {
    const { userId, eventId } = createInviteInput;

    const user = await this.authService.findOne(userId);
    const event = await this.eventsRepository.findOne(eventId);

    const invite = this.inviteRepository.create({
      user,
      event,
    });

    await this.inviteRepository.save(invite);

    return invite;
  }

  async update(id: string, updateEventInput: UpdateEventInput): Promise<Event> {
    let event = await this.findOne(id);
    const users = await this.authService.findAll({
      ids: updateEventInput.visitors,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    event = {
      ...event,
      ...updateEventInput,
      visitors: users,
      location: updateEventInput.location
        ? convertLocationToPoint(updateEventInput.location)
        : event.location,
    };
    await this.eventsRepository.save(event);

    return event;
  }

  async processEventImages(
    eventId: string,
    images: string[],
  ): Promise<boolean> {
    const event = await this.findOne(eventId);

    event.photos = [...event.photos, ...images];
    await this.eventsRepository.save(event);

    return true;
  }

  async remove(id: string): Promise<boolean> {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);

    return true;
  }
}
