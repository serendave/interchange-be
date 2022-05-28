import {
  Query,
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserType } from './entities/user.type';
import { CreateUserInput, SignInInput, UpdateUserInput } from './dto';
import { AuthResponse } from './entities/auth-response.type';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGraphQLGuard } from './guards';
import { GetUsersInput } from './dto/get-users.input';

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

  @ResolveField()
  async location(@Parent() user: User) {
    const userData = await this.authService.findOne(user.id);
    return {
      latitude: userData.location.coordinates[1],
      longitude: userData.location.coordinates[0],
    };
  }

  @Query(() => [UserType], { name: 'users' })
  findAll(
    @Args({
      name: 'getUsersInput',
      type: () => GetUsersInput,
      nullable: true,
    })
    getUsersInput: GetUsersInput,
  ) {
    return this.authService.findAll(getUsersInput);
  }

  @Query(() => UserType, { name: 'user' })
  findOne(@Args('id') id: string) {
    return this.authService.findOne(id);
  }

  @Mutation(() => UserType)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.authService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => UserType)
  removeUser(@Args('id') id: string) {
    return this.authService.remove(id);
  }
}
