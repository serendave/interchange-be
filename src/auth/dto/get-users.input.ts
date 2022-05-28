import { Field, InputType, ID } from '@nestjs/graphql';

@InputType()
export class GetUsersInput {
  @Field(() => [ID])
  ids: string[];
}
