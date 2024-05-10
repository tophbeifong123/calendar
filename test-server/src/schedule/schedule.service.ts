import { Injectable, SerializeOptions } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, Like, Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>,
  ) {}

  async findAll(query: { [key: string]: any }): Promise<Schedule[]> {
    Object.keys(query).forEach((key) => {
      if (typeof query[key] === 'string') {
        query[key] = Like(`${query[key]}%`);
      }
    });
    const findOptions: FindManyOptions<Schedule> = {
      where : query,
      relations : ['createBy', 'votedBy']
    }
    return this.schedulesRepository.find(findOptions);
  }

  async findOne(id: number): Promise<Schedule | null> {
    return this.schedulesRepository.findOne({
      where: { id : id },
      relations : ['createBy', 'votedBy']
    });
  }
  

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const scheduleEntity = this.schedulesRepository.create(createScheduleDto);
    return this.schedulesRepository.save(scheduleEntity);
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return this.schedulesRepository.update(id, updateScheduleDto);
  }

  async remove(id: number): Promise<void> {
    await this.schedulesRepository.delete(id);
  }};