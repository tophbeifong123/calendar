
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm"

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    id : number
    
    @Column({nullable: true})
    subjectType: string

    @Column({nullable: true})
    title: string
    
    @Column({nullable: true})
    details : string

    @Column({nullable: true})
    startTime : string
    
    @Column({nullable: true})
    stopTime : string

    @Column({nullable: true})
    photo : string

    @Column({nullable: true})
    createdAt: string;


}
