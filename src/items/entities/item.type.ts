import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('Item')
export class ItemType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description?: string;

  @Field()
  dateCreated: string;

  @Field()
  active: boolean;

  @Field(() => [String])
  tags?: string;
}
