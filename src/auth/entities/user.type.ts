import { ObjectType, Field, Float, ID } from '@nestjs/graphql';
import { Location } from '../dto';

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

  @Field(() => Location)
  location: Location;
}
