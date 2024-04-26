
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm"

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    id : number

    @Column({nullable: false})
    eduYear : string

    @Column({nullable: false})
    eduTerm : string

    @Column({nullable: false})
    startRecur : string
    
    
}
