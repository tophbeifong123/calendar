export class CreateEventDto {
  readonly title: string;
  readonly description: string;
  readonly start: string;
  readonly end: string;
  readonly eventIdGoogle?: string;
  readonly user: { id: number; studentId: string };
}
