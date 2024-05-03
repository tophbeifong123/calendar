import { Injectable, SerializeOptions } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(query: { [key: string]: any }): Promise<User[]> {
    Object.keys(query).forEach((key) => {
      if (typeof query[key] === 'string') {
        query[key] = Like(`${query[key]}%`);
      }
    });
    const findOptions: FindManyOptions<User> = {
      where : query,
      relations: { events: true },
    }
    return this.usersRepository.find(findOptions);
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id: id },
      relations: { events: true },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userEntity = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(userEntity);
  }

  async update(id: number, createUserDto: CreateUserDto) {
    return this.usersRepository.update(id, createUserDto);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }}