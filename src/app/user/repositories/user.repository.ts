import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { serverError } from 'src/app/util/server-error';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { ProfilePicture } from '../service/dto/insert-profile-picture.dto';
import { UpdateUserDto } from '../service/dto/update-user.dto';
import { DbCreateUserDto } from './dto/db-create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(data: DbCreateUserDto): Promise<UserEntity> {
    const createdUser: UserEntity = this.userRepository.create(data);
    const savedUser: UserEntity = await this.userRepository
      .save(createdUser)
      .catch(serverError);
    return savedUser;
  }

  async insertProfilePicture(data: ProfilePicture): Promise<UserEntity> {
    const userMerge = this.userRepository.merge(data.user, {
      imageUrl: data.imageUrl,
    });
    const userUpdated = await this.userRepository
      .save(userMerge)
      .catch(serverError);
    return userUpdated;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const userOrNull = await this.userRepository
      .findOne({
        where: { email },
      })
      .catch(serverError);
    return userOrNull;
  }

  async findUserById(id: string): Promise<UserEntity> {
    const userOrNull = await this.userRepository
      .findOne({
        where: { id },
      })
      .catch(serverError);
    return userOrNull;
  }

  async findAllUsers(): Promise<UserEntity[]> {
    const userOrNull = await this.userRepository.find().catch(serverError);
    return userOrNull;
  }

  async updateUserByEntity(
    user: UserEntity,
    data: UpdateUserDto,
  ): Promise<UserEntity> {
    const userMerge = this.userRepository.merge(user, data);
    const userUpdated = await this.userRepository
      .save(userMerge)
      .catch(serverError);
    return userUpdated;
  }

  async deleteUserById(id: string): Promise<void> {
    await this.userRepository.softDelete(id).catch(serverError);
  }
}
