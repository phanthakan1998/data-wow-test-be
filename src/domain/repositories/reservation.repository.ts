import { Reservation } from '../entities/reservation.entity';

export interface ReservationRepositoryModel {
  findAll(): Promise<Reservation[]>;
  create(reservation: Reservation): Promise<Reservation>;
  cancelByConcertAndUser(concertId: string, userId: string): Promise<void>;
  findByUser(userId: string): Promise<Reservation[]>;
  findByConcert(concertId: string): Promise<Reservation[]>;
  countByConcert(concertId: string): Promise<number>;
  findByConcertAndUser(
    concertId: string,
    userId: string,
  ): Promise<Reservation | null>;
  countActive(): Promise<number>;
  countCanceled(): Promise<number>;
  countGroupByConcert(): Promise<Record<string, number>>;
}
