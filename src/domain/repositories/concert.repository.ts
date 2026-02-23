import { Concert } from '../entities/concert.entity';

export interface ConcertRepository {
  create(concert: Concert): Promise<Concert>;
  findAll(): Promise<Concert[]>;
}
