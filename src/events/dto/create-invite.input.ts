import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateInviteInput {
  @Field()
  userId: string;

  @Field()
  eventId: string;
}
