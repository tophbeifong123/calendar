import { Injectable, SerializeOptions } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, Like, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async findAll(query: { [key: string]: any }): Promise<Event[]> {
    Object.keys(query).forEach((key) => {
      if (typeof query[key] === 'string') {
        query[key] = Like(`${query[key]}%`);
      }
    });
    const findOptions: FindManyOptions<Event> = {
      where: query,
      relations: { user: true },
    };
    return this.eventsRepository.find(findOptions);
  }

  async findOne(id: number): Promise<Event | null> {
    return this.eventsRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const eventEntity = this.eventsRepository.create(createEventDto);
    return this.eventsRepository.save(eventEntity);
  }

  async update(id: number, createEventDto: CreateEventDto) {
    return this.eventsRepository.update(id, createEventDto);
  }

  async remove(id: number): Promise<void> {
    await this.eventsRepository.delete(id);
  }
}
