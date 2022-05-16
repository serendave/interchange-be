import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class Location {
  @Field(() => Float)
  latitude?: number;

  @Field(() => Float)
  longitude?: number;
}

@InputType()
export class CreateUserInput {
  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;

  @MinLength(3)
  @Field()
  firstName: string;

  @MinLength(3)
  @Field()
  lastName: string;

  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password should contain at least 1 uppercase letter, 1 lowerase letter, 1 number or special character',
  })
  @Field()
  password: string;

  @Field(() => Location)
  location: Location;
}
