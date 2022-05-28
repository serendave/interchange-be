import { InputType, ID, Field } from '@nestjs/graphql';
import { IsUUID, MinLength } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field()
  @MinLength(3)
  name: string;

  @Field()
  description?: string;

  @Field(() => ID)
  categoryId: string;

  @IsUUID('all', { each: true })
  @Field(() => [ID], { defaultValue: [] })
  tags?: string[];
}
