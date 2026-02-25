import { Reservation } from '../entities/reservation.entity';

export interface ReservationRepository {
  findAll(): Promise<Reservation[]>;
  create(reservation: Reservation): Promise<Reservation>;
  deleteByConcertAndUser(concertId: string, userId: string): Promise<void>;
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
