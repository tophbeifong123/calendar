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
    const studentId = query.studentId;
    delete query.studentId; // Remove studentId from query

    const qb = this.schedulesRepository.createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.createBy', 'createBy')
      .leftJoinAndSelect('schedule.votedBy', 'votedBy')
      .where(query);

    // Apply votedBy filter
    if (studentId) {
      qb.andWhere('votedBy.studentId = :studentId', { studentId });
    }

    return qb.getMany();
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