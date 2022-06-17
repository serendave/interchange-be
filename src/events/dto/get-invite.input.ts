import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetInvitesInput {
  @Field()
  userId: string;
}
