import { randomUUID } from 'crypto';
import { Concert } from 'src/domain/entities/concert.entity';
import { ConcertRepository } from 'src/domain/repositories/concert.repository';

export class ConcertUseCase {
  constructor(private readonly concertRepo: ConcertRepository) {}

  async create(
    name: string,
    description: string,
    totalSeats: number,
  ): Promise<Concert> {
    const concert = new Concert(randomUUID(), name, description, totalSeats);

    return this.concertRepo.create(concert);
  }

  async getAll() {
    return this.concertRepo.findAll();
  }
}
