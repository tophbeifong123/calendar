
import { User } from "src/user/entities/user.entity"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinTable } from "typeorm"

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id : number

    @Column({nullable: false})
    title : string

    @Column()
    description : string

    @Column({nullable: false})
    start : string

    @Column({nullable: false})
    end : string
    
    @ManyToOne(()=> User,(user) => user.events)
    user: User

    
}
