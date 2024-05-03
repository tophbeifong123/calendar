import { Event } from 'src/event/entities/event.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({unique:true})
    studentId: string;

    @OneToMany(()=> Event,(event) => event.user)
    events: Event[]

}
