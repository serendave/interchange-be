import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserType } from './entities/user.type';
import { CreateUserInput, SignInInput } from './dto';
import { AuthResponse } from './entities/auth-response.type';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGraphQLGuard } from './guards';

@Resolver(() => UserType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signup' })
  signUp(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.signUp(createUserInput);
  }

  @Mutation(() => AuthResponse, { name: 'signin' })
  signIn(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }

  @UseGuards(AuthGraphQLGuard)
  @Query(() => UserType)
  getMyInfo(@GetUser() user: User) {
    return user;
  }

  // @Query(() => [UserType], { name: 'users' })
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Query(() => UserType, { name: 'user' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.authService.findOne(id);
  // }

  // @Mutation(() => UserType)
  // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //   return this.authService.update(updateUserInput.id, updateUserInput);
  // }

  // @Mutation(() => UserType)
  // removeUser(@Args('id', { type: () => Int }) id: number) {
  //   return this.authService.remove(id);
  // }
}
