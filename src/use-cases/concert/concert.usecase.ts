import { randomUUID } from 'crypto';
import { Concert } from 'src/domain/entities/concert.entity';
import { HistoryLog } from 'src/domain/entities/history.entity';
import { Reservation } from 'src/domain/entities/reservation.entity';
import { ConcertRepositoryModel } from 'src/domain/repositories/concert.repository';
import { HistoryRepositoryModel } from 'src/domain/repositories/history.repository';
import { ReservationRepositoryModel } from 'src/domain/repositories/reservation.repository';
import { IDashBoardResponseDto } from 'src/presentation/dto/response/concert-response.dto';

export class ConcertUseCase {
  constructor(
    private readonly concertRepository: ConcertRepositoryModel,
    private readonly reservationRepository: ReservationRepositoryModel,
    private readonly historyRepository: HistoryRepositoryModel,
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

  async getAllReservations(): Promise<Reservation[]> {
    return this.reservationRepository.findAll();
  }

  async getDashboardSummary(): Promise<IDashBoardResponseDto> {
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
