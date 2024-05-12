import { User } from "src/user/entities/user.entity";

export class CreateScheduleDto {
    readonly subjectCode:string;
    readonly title:string;
    readonly description:string;
    readonly startTime:string;
    readonly stopTime:string;
    readonly image: string;
    readonly createBy: User;
    readonly createdDate: string;
    readonly vote: number;
    readonly status: boolean;

}
