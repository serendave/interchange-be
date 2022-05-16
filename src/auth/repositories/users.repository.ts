import { EntityRepository, Repository } from 'typeorm';
import { CreateUserInput } from '../dto/create-user.input';
import { User } from '../entities/user.entity';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Point } from 'geojson';
import { DBErrorCodes } from 'src/constants';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const { password, location } = createUserInput;

    const salt = await bcrypt.genSalt();
    const passpordHash = await bcrypt.hash(password, salt);

    delete createUserInput.password;

    const locationObject: Point = {
      type: 'Point',
      coordinates: [location?.longitude, location?.latitude],
    };

    const user = this.create({
      ...createUserInput,
      id: uuid(),
      password: passpordHash,
      location: locationObject,
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
}
