import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';
import { User } from 'src/user/entities/user.entity';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
    readonly votedBy: User;
}
