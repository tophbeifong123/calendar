import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ApiModule } from './api/api.module';
import { ScheduleModule } from './schedule/schedule.module';
import { Api } from './api/entities/api.entity';
import { Schedule } from './schedule/entities/schedule.entity';
import { EventModule } from './event/event.module';
import { Event } from './event/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './app.sqlite',
      entities: [User, Api, Schedule, Event],
      synchronize: process.env.NODE_ENV != 'production',
    }),
    UserModule,
    ApiModule,
    ScheduleModule,
    EventModule,
  ],
})
export class AppModule {}
