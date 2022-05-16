import { InputType, Field, ID, PartialType, Float } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  rating?: number;
}
