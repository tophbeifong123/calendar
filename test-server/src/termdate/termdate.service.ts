import { Injectable, SerializeOptions } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, Like, Repository } from 'typeorm';
import { Termdate } from './entities/termdate.entity';
import { CreateTermdateDto } from './dto/create-termdate.dto';
import { UpdateTermdateDto } from './dto/update-termdate.dto';

@Injectable()
export class TermdatesService {
  constructor(
    @InjectRepository(Termdate)
    private termdatesRepository: Repository<Termdate>,
  ) {}

  async findAll(query: { [key: string]: any }): Promise<Termdate[]> {
    Object.keys(query).forEach((key) => {
      if (typeof query[key] === 'string') {
        query[key] = Like(`${query[key]}%`);
      }
    });
    const findOptions: FindManyOptions<Termdate> = {
      where : query,
      // relations : ['user']
    }
    return this.termdatesRepository.find(findOptions);
  }

  async findOne(id: number): Promise<Termdate | null> {
    return this.termdatesRepository.findOne({
      where: { id : id },
    });
  }
  

  async create(createScheduleDto: CreateTermdateDto): Promise<Termdate> {
    const scheduleEntity = this.termdatesRepository.create(createScheduleDto);
    return this.termdatesRepository.save(scheduleEntity);
  }

  async update(id: number, updateTermdateDto: UpdateTermdateDto) {
    return this.termdatesRepository.update(id, updateTermdateDto);
  }

  async remove(id: number): Promise<void> {
    await this.termdatesRepository.delete(id);
  }};