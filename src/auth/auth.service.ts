import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInput, SignInInput } from './dto';
import { JwtPayload } from './interfaces/jwt-payload';
import { UsersRepository } from './repositories/users.repository';
import { JWTResponse } from './interfaces/jwt-response';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserInput: CreateUserInput): Promise<JWTResponse> {
    const user = await this.usersRepository.createUser(createUserInput);
    const payload: JwtPayload = { email: user.email };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async signIn(signInInput: SignInInput): Promise<JWTResponse> {
    if (await this.userExists(signInInput)) {
      const payload: JwtPayload = { email: signInInput.email };
      const accessToken = await this.jwtService.signAsync(payload);

      return { accessToken };
    }
  }

  async signInWithTelegram(signInInput: SignInInput): Promise<User> {
    return this.userExists(signInInput);
  }

  private async userExists(signInInput: SignInInput): Promise<User> {
    const { email, password } = signInInput;
    const user = await this.usersRepository.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
