import { randomUUID } from 'crypto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConcertRepository } from 'src/domain/repositories/concert.repository';
import { ReservationRepository } from 'src/domain/repositories/reservation.repository';
import { Reservation } from 'src/domain/entities/reservation.entity';
import { ConcertStatus } from 'src/infrastructure/common/enums/reservation';
import { HistoryRepository } from 'src/domain/repositories/history.repository';
import { HistoryLog } from 'src/domain/entities/history.entity';
import { HistoryAction } from 'src/infrastructure/common/enums/history';

export class ReservationUseCase {
  constructor(
    private readonly concertRepository: ConcertRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly historyRepository: HistoryRepository,
  ) {}

  async reserveSeat(concertId: string, userId: string): Promise<Reservation> {
    const concert = await this.concertRepository.findById(concertId);

    if (!concert) {
      throw new NotFoundException('Concert not found');
    }

    const existing = await this.reservationRepository.findByConcertAndUser(
      concertId,
      userId,
    );

    if (existing) {
      throw new BadRequestException(
        'User already reserved a seat for this concert',
      );
    }

    const count = await this.reservationRepository.countByConcert(concertId);

    if (concert.isFullyBooked(count)) {
      throw new BadRequestException('No seats available');
    }

    const reservation = new Reservation(randomUUID(), concertId, userId);

    const saved = await this.reservationRepository.create(reservation);

    const userName = 'John';

    const history = new HistoryLog(
      randomUUID(),
      concert.name,
      userId,
      userName,
      HistoryAction.RESERVE,
      new Date(),
    );

    await this.historyRepository.create(history);

    return saved;
  }

  async cancelReservation(concertId: string, userId: string): Promise<void> {
    await this.reservationRepository.deleteByConcertAndUser(concertId, userId);
  }

  async getUserReservations(userId: string) {
    const userReservations =
      await this.reservationRepository.findByUser(userId);

    const allConcerts = await this.concertRepository.findAll();

    const reservationCounts =
      await this.reservationRepository.countGroupByConcert();

    return allConcerts.map((concert) => {
      const reservedCount = reservationCounts[concert.id] ?? 0;

      const isReservedByUser = userReservations.some(
        (item) => item.concertId === concert.id,
      );

      let status: ConcertStatus;

      if (isReservedByUser) {
        status = ConcertStatus.RESERVED;
      } else if (concert.isFullyBooked(reservedCount)) {
        status = ConcertStatus.FULL;
      } else {
        status = ConcertStatus.AVAILABLE;
      }

      return {
        id: concert.id,
        name: concert.name,
        description: concert.description,
        totalSeats: concert.totalSeats,
        status,
      };
    });
  }
  // async getConcertReservations(concertId: string) {
  //   return this.reservationRepository.findByConcert(concertId);
  // }

  // async getAllReservations() {
  //   return this.reservationRepository.findAll();
  // }

  // async getDashboardSummary() {
  //   const totalSeats = await this.concertRepository.sumTotalSeats();
  //   const totalReserved = await this.reservationRepository.countActive();
  //   const totalCanceled = await this.reservationRepository.countCanceled();

  //   return {
  //     totalSeats,
  //     totalReserved,
  //     totalCanceled,
  //   };
  // }
}
