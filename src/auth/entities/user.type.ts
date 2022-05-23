import { ObjectType, Field, Float, ID } from '@nestjs/graphql';

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

  @Field(() => LocationData)
  location: LocationData;
}
