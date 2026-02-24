import { randomUUID } from 'crypto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Concert } from 'src/domain/entities/concert.entity';
import { ConcertRepository } from 'src/domain/repositories/concert.repository';
import { ReservationRepository } from 'src/domain/repositories/reservation.repository';
import { Reservation } from 'src/domain/entities/reservation.entity';

export class ConcertUseCase {
  constructor(
    private readonly concertRepo: ConcertRepository,
    private readonly reservationRepo: ReservationRepository,
  ) {}

  async create(
    name: string,
    description: string,
    totalSeats: number,
  ): Promise<Concert> {
    const concert = new Concert(randomUUID(), name, description, totalSeats);

    return this.concertRepo.create(concert);
  }

  async getAll(): Promise<Concert[]> {
    return this.concertRepo.findAll();
  }

  async deleteConcert(id: string): Promise<void> {
    await this.concertRepo.delete(id);
  }

  async reserveSeat(concertId: string, userId: string): Promise<Reservation> {
    const concert = await this.concertRepo.findById(concertId);

    if (!concert) {
      throw new NotFoundException('Concert not found');
    }

    const result = await this.reservationRepo.findByConcertAndUser(
      concertId,
      userId,
    );

    if (result) {
      throw new BadRequestException(
        'User already reserved a seat for this concert',
      );
    }

    const count = await this.reservationRepo.countByConcert(concertId);

    if (count >= concert.totalSeats) {
      throw new BadRequestException('No seats available');
    }

    const reservation = new Reservation(randomUUID(), concertId, userId);

    return this.reservationRepo.create(reservation);
  }

  async cancelReservation(concertId: string, userId: string): Promise<void> {
    await this.reservationRepo.deleteByConcertAndUser(concertId, userId);
  }

  async getUserReservations(userId: string) {
    return this.reservationRepo.findByUser(userId);
  }

  async getConcertReservations(concertId: string) {
    return this.reservationRepo.findByConcert(concertId);
  }

  async getAllReservations() {
    return this.reservationRepo.findAll();
  }
}
