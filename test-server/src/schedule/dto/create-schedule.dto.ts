import { User } from "src/user/entities/user.entity";

export class CreateScheduleDto {
    readonly subjectType:string;
    readonly title:string;
    readonly description:string;
    readonly startTime:string;
    readonly stopTime:string;
    readonly image: string;
    readonly createBy: User;
    readonly createdAt: string;

}
