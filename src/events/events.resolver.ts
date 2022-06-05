import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { EventsService } from './events.service';
import { EventType } from './entities/event.type';
import {
  CreateEventInput,
  CreateInviteInput,
  UpdateEventInput,
  JoinEventInput,
  GetEventsInput,
} from './dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGraphQLGuard } from 'src/auth/guards';
import { InviteType } from './entities/invite.type';

@UseGuards(AuthGraphQLGuard)
@Resolver(() => EventType)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Mutation(() => EventType)
  createEvent(
    @GetUser() user: User,
    @Args('createEventInput') createEventInput: CreateEventInput,
  ) {
    return this.eventsService.create(user, createEventInput);
  }

  @Query(() => [EventType], { name: 'events' })
  findAll(
    @Args('getEventsInput', { nullable: true }) getEventsInput?: GetEventsInput,
  ) {
    return this.eventsService.findAll(getEventsInput);
  }

  @Query(() => EventType, { name: 'event' })
  findOne(@Args('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @ResolveField()
  async location(@Parent() event: EventType) {
    const eventData = await this.eventsService.findOne(event.id);
    return {
      latitude: eventData.location.coordinates[1],
      longitude: eventData.location.coordinates[0],
    };
  }

  @Mutation(() => EventType)
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventsService.update(updateEventInput.id, updateEventInput);
  }

  @Mutation(() => EventType)
  joinEvent(@Args('joinEventInput') joinEventInput: JoinEventInput) {
    return this.eventsService.joinEvent(joinEventInput);
  }

  @Mutation(() => InviteType)
  createInvite(
    @Args('createInviteInput') createInviteInput: CreateInviteInput,
  ) {
    return this.eventsService.createInvite(createInviteInput);
  }

  @Mutation(() => EventType)
  removeEvent(@Args('id') id: string) {
    return this.eventsService.remove(id);
  }
}
