import { Concert } from '../entities/concert.entity';

export interface ConcertRepository {
  create(concert: Concert): Promise<Concert>;
  findAll(): Promise<Concert[]>;
  findById(id: string): Promise<Concert | null>;
  delete(id: string): Promise<void>;
  sumTotalSeats(): Promise<number>;
}
