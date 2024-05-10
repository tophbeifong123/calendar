import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
@Entity()
export class Termdate {
    @PrimaryGeneratedColumn()
    id : number

    @Column({nullable: false})
    eduYear : string

    @Column({nullable: false})
    eduTerm : string

    @Column({nullable: false})
    startRecur : string
}
