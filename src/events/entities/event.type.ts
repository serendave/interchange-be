import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/auth/entities/user.entity';
import { LocationData, UserType } from 'src/auth/entities/user.type';

@ObjectType()
export class EventType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => LocationData)
  location: LocationData;

  @Field()
  photo?: string;

  @Field()
  dateCreated: string;

  @Field()
  active: boolean;

  @Field(() => UserType)
  creator: UserType;

  @Field(() => [UserType])
  vititors: User[];
}
