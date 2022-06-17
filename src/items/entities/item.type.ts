import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { UserType } from 'src/auth/entities/user.type';
import { CategoryType } from 'src/categories/entities/category.type';

@ObjectType('Item')
export class ItemType {
  @Field(() => ID)
  id: string;

  @Field(() => UserType, { nullable: true })
  user: UserType;

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
