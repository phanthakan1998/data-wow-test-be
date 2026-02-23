import { IsString, IsNumber, Min } from 'class-validator';

export class CreateConcertDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  totalSeats: number;
}
