import { EntityRepository, Repository } from 'typeorm';
import { GetEventsInput } from '../dto/get-event.input';
import { Event } from '../entities/event.entity';

@EntityRepository(Event)
export class EventsResository extends Repository<Event> {
  async getEvents(getEventInput?: GetEventsInput): Promise<Event[]> {
    const query = this.createQueryBuilder('event')
      .leftJoinAndSelect('event.visitors', 'visitor')
      .leftJoinAndSelect('event.creator', 'creator');

    if (getEventInput?.creatorId) {
      query.andWhere('creator.id = :creatorId', {
        creatorId: getEventInput.creatorId,
      });
    }

    if (getEventInput?.visitorId) {
      query.andWhere('visitor.id = :vistitorId', {
        vistitorId: getEventInput.visitorId,
      });
    }

    const events = await query.getMany();
    return events;
  }
}
