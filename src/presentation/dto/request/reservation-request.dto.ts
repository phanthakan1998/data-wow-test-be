import { IsUUID } from 'class-validator';

export class ReserveSeatDto {
  @IsUUID()
  userId: string;
}
