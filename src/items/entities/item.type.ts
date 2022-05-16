import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType('Item')
export class ItemType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description?: string;

  @Field(() => GraphQLISODateTime)
  dateCreated: Date;

  @Field()
  active: boolean;

  @Field(() => [String])
  tags?: string;
}
