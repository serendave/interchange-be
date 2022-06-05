import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { EventsResository } from './repositories/event.repository';
import { Event } from './entities/event.entity';
import { User } from 'src/auth/entities/user.entity';
import { convertLocationToPoint } from 'src/utils';
import { AuthService } from 'src/auth/auth.service';
import { JoinEventInput } from './dto/join-event.input';
import { GetEventsInput } from './dto/get-event.input';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventsResository)
    private eventsRepository: EventsResository,
    private authService: AuthService,
  ) {}

  async create(user: User, createEventInput: CreateEventInput): Promise<Event> {
    const users = await this.authService.findAll({
      ids: createEventInput.visitors,
    });

    const event = this.eventsRepository.create({
      id: uuid(),
      ...createEventInput,
      creator: user,
      visitors: users,
      location: convertLocationToPoint(createEventInput.location),
    });

    await this.eventsRepository.save(event);

    return event;
  }

  async findAll(getEventsInput?: GetEventsInput): Promise<Event[]> {
    const events = this.eventsRepository.getEvents(getEventsInput);
    return events;
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

    return event;
  }

  async update(id: string, updateEventInput: UpdateEventInput): Promise<Event> {
    let event = await this.findOne(id);
    const users = await this.authService.findAll({
      ids: updateEventInput.visitors,
    });

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

  async remove(id: string): Promise<boolean> {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);

    return true;
  }
}
