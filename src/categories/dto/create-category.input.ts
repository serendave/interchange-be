import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @IsNotEmpty()
  @MinLength(3)
  @Field()
  name: string;
}
