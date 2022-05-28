import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GetItemsInput {
  @Field()
  user?: string;
}
