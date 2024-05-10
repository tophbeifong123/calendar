import { isString } from "util";

export class CreateScheduleDto {
    readonly subjectType:string;
    readonly title:string;
    readonly details:string;
    readonly startTime:string;
    readonly stopTime:string;
    readonly image: any;
    readonly createdAt: string;
}
