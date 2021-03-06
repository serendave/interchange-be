import { ObjectType, Field, Float, ID } from '@nestjs/graphql';
import { Invite } from 'src/events/entities/invite.entity';
import { InviteType } from 'src/events/entities/invite.type';
import { Item } from 'src/items/entities/item.entity';
import { ItemType } from 'src/items/entities/item.type';

@ObjectType()
export class LocationData {
  @Field(() => Float)
  latitude?: number;

  @Field(() => Float)
  longitude?: number;
}

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  password: string;

  @Field(() => Float)
  rating: number;

  @Field()
  dateJoined: string;

  @Field({ nullable: true })
  photo?: string;

  @Field(() => [ItemType])
  items: Item[];

  @Field(() => LocationData)
  location: LocationData;

  @Field(() => [InviteType], { nullable: true })
  invitations: Invite[];
}
