import { IsString, IsNumber, Min, IsUUID } from 'class-validator';

export class CreateConcertDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  totalSeats: number;
}

export class ReserveSeatDto {
  @IsUUID()
  userId: string;
}
