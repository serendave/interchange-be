import { EntityRepository, Repository } from 'typeorm';
import { CreateUserInput } from '../dto/create-user.input';
import { User } from '../entities/user.entity';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { DBErrorCodes } from 'src/constants';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { convertLocationToPoint } from 'src/utils/format';
import { GetUsersInput } from '../dto/get-users.input';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const { password, location } = createUserInput;

    const salt = await bcrypt.genSalt();
    const passpordHash = await bcrypt.hash(password, salt);

    delete createUserInput.password;

    const user = this.create({
      ...createUserInput,
      id: uuid(),
      password: passpordHash,
      location: convertLocationToPoint(location),
    });

    try {
      await this.save(user);
      return user;
    } catch (e) {
      if (e.code === DBErrorCodes.NOT_UNIQUE) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUsers(getUsersInput: GetUsersInput): Promise<User[]> {
    const query = this.createQueryBuilder('user');

    if (getUsersInput?.ids?.length) {
      query.where('user.id IN(:ids)', { ids: [...getUsersInput.ids] });
    }

    if (getUsersInput?.email) {
      query.andWhere('user.email LIKE :email', {
        email: `${getUsersInput.email}%`,
      });
    }

    if (getUsersInput?.checkForInvite) {
      query
        .leftJoinAndSelect('user.invitations', 'invite')
        .leftJoinAndSelect('invite.event', 'event');
    }

    const users = await query.getMany();
    return users;
  }
}
