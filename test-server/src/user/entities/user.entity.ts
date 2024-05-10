import { Event } from 'src/event/entities/event.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({unique:true})
    studentId: string;

    @OneToMany(()=> Event,(event) => event.user)
    events: Event[]

    @OneToMany(() => Schedule, (schedule) => schedule.createBy)
    createdSchedules: Schedule[];

    @OneToMany(() => Schedule, (schedule) => schedule.votedBy)
    votedSchedules: Schedule[];

}
