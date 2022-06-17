import { ObjectType, Field, ID } from '@nestjs/graphql';
import { LocationData, UserType } from 'src/auth/entities/user.type';

@ObjectType()
export class EventType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  photos: string[];

  @Field()
  private: boolean;

  @Field(() => LocationData)
  location: LocationData;

  @Field()
  address: string;

  @Field()
  dateCreated: string;

  @Field()
  active: boolean;

  @Field(() => UserType)
  creator: UserType;

  @Field(() => [UserType])
  visitors: UserType[];
}
