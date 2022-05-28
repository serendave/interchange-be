import { InputType, Field, ID } from '@nestjs/graphql';
import { Location } from 'src/auth/dto/create-user.input';

@InputType()
export class CreateEventInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Location)
  location: Location;

  @Field(() => [ID])
  visitors?: string[];
}
