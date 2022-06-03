import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class JoinEventInput {
  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  eventId: string;
}
