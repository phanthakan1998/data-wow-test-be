import { Reservation } from '../entities/reservation.entity';

export interface ReservationRepositoryModel {
  findAll(): Promise<Reservation[]>;
  create(reservation: Reservation): Promise<Reservation>;
  findByUser(userId: string): Promise<Reservation[]>;
  findByConcert(concertId: string): Promise<Reservation[]>;
  findByConcertAndUser(
    concertId: string,
    userId: string,
  ): Promise<Reservation | null>;
  countByConcert(concertId: string): Promise<number>;
  countByStatus(isCanceled: boolean): Promise<number>;
  countGroupByConcert(): Promise<Record<string, number>>;
  updateReservationStatus(
    concertId: string,
    userId: string,
    isCanceled: boolean,
  ): Promise<void>;
  deleteByConcert(concertId: string): Promise<void>;
}
