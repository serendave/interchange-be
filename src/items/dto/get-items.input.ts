import { InputType, Field } from '@nestjs/graphql';
import { Location } from 'src/auth/dto/create-user.input';

@InputType()
export class GetItemsInput {
  @Field({ nullable: true })
  user?: string;

  @Field({ nullable: true })
  selectUser?: boolean;

  @Field({ nullable: true })
  sortBy?: 'name' | 'date';

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  location?: Location;

  @Field({ nullable: true })
  range?: number;
}
