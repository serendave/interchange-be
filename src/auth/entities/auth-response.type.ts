import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from './user.type';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field(() => UserType)
  user: UserType;
}
