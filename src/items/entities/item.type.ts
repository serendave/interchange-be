import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { CategoryType } from 'src/categories/entities/category.type';

@ObjectType('Item')
export class ItemType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  user: string;

  @Field(() => CategoryType)
  category?: CategoryType;

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

  @Field(() => [String])
  photos?: string[];
}
