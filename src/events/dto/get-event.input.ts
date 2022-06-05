import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetEventsInput {
  @Field({ nullable: true })
  creatorId: string;

  @Field({ nullable: true })
  visitorId: string;
}
