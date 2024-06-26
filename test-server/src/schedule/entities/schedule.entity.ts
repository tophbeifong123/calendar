
import { User } from "src/user/entities/user.entity"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm"

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    id : number
    
    @Column({nullable: true})
    subjectCode: string

    @Column({nullable: true})
    title: string
    
    @Column({nullable: true})
    description : string

    @Column({nullable: true})
    startTime : string
    
    @Column({nullable: true})
    stopTime : string

    @Column({nullable: false})
    image : string
    
    @Column({nullable: true})
    vote: number
    
    @ManyToOne(()=> User,(user) => user.createdSchedules)
    createBy: User

    @ManyToOne(()=> User,(user) => user.votedSchedules)
    votedBy: User

    @Column({nullable: true})
    createdDate: string;

    @Column({nullable: true})
    status: boolean;
}
