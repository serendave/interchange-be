import { Field, InputType, ID } from '@nestjs/graphql';

@InputType()
export class GetUsersInput {
  @Field(() => [ID], { nullable: true })
  ids: string[];

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  checkForInvite?: boolean;
}
