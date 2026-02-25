import { randomUUID } from 'crypto';
import { Concert } from 'src/domain/entities/concert.entity';
import { HistoryLog } from 'src/domain/entities/history.entity';
import { ConcertRepository } from 'src/domain/repositories/concert.repository';
import { HistoryRepository } from 'src/domain/repositories/history.repository';
import { ReservationRepository } from 'src/domain/repositories/reservation.repository';

export class ConcertUseCase {
  constructor(
    private readonly concertRepository: ConcertRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly historyRepository: HistoryRepository,
  ) {}

  async create(
    name: string,
    description: string,
    totalSeats: number,
  ): Promise<Concert> {
    const concert = new Concert(randomUUID(), name, description, totalSeats);

    return this.concertRepository.create(concert);
  }

  async getAll(): Promise<Concert[]> {
    return this.concertRepository.findAll();
  }

  async deleteConcert(id: string): Promise<void> {
    await this.concertRepository.delete(id);
  }

  async getAllReservations() {
    return this.reservationRepository.findAll();
  }

  async getDashboardSummary() {
    const totalSeats = await this.concertRepository.sumTotalSeats();
    const totalReserved = await this.reservationRepository.countActive();
    const totalCanceled = await this.reservationRepository.countCanceled();

    return {
      totalSeats,
      totalReserved,
      totalCanceled,
    };
  }

  async getHistory(): Promise<HistoryLog[]> {
    return this.historyRepository.findAll();
  }
}
