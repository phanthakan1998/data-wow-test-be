import { Concert } from 'src/domain/entities/concert.entity';

export class ConcertResponseDto {
  id: string;
  name: string;
  description: string;
  totalSeats: number;

  constructor(concert: Concert) {
    this.id = concert.id;
    this.name = concert.name;
    this.description = concert.description;
    this.totalSeats = concert.totalSeats;
  }
}
