import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/auth/entities/user.entity';
import { UserType } from 'src/auth/entities/user.type';
import { EventType } from './event.type';

@ObjectType()
export class InviteType {
  @Field(() => ID)
  id: string;

  @Field(() => EventType)
  event: Event;

  @Field(() => UserType)
  user: User;
}
