import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationRepositoryModel } from 'src/domain/repositories/reservation.repository';
import { Reservation } from 'src/domain/entities/reservation.entity';
import { ReservationOrmEntity } from '../database/reservation.model';

@Injectable()
export class ReservationTypeOrmRepository implements ReservationRepositoryModel {
  constructor(
    @InjectRepository(ReservationOrmEntity)
    private readonly reservationRepository: Repository<ReservationOrmEntity>,
  ) {}

  async findAll(): Promise<Reservation[]> {
    const data = await this.reservationRepository.find();

    return data.map(
      (item) => new Reservation(item.id, item.concertId, item.userId),
    );
  }
  //TODO delete clear all reseve

  async create(reservation: Reservation): Promise<Reservation> {
    const orm = this.reservationRepository.create({
      id: reservation.id,
      concertId: reservation.concertId,
      userId: reservation.userId,
    });

    const saved = await this.reservationRepository.save(orm);

    return new Reservation(saved.id, saved.concertId, saved.userId);
  }

  async cancelByConcertAndUser(
    concertId: string,
    userId: string,
  ): Promise<void> {
    const result = await this.reservationRepository.update(
      { concertId, userId },
      { isCanceled: true },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Reservation not found');
    }
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    const data = await this.reservationRepository.find({
      where: { userId },
    });

    return data.map(
      (item) => new Reservation(item.id, item.concertId, item.userId),
    );
  }

  async findByConcert(concertId: string): Promise<Reservation[]> {
    const data = await this.reservationRepository.find({
      where: { concertId },
    });

    return data.map(
      (item) => new Reservation(item.id, item.concertId, item.userId),
    );
  }

  async findByConcertAndUser(
    concertId: string,
    userId: string,
  ): Promise<Reservation | null> {
    const item = await this.reservationRepository.findOne({
      where: { concertId, userId },
    });

    if (!item) return null;

    return new Reservation(item.id, item.concertId, item.userId);
  }

  async countByConcert(concertId: string): Promise<number> {
    return this.reservationRepository.count({
      where: { concertId },
    });
  }
  async countActive(): Promise<number> {
    return this.reservationRepository.count({
      where: { isCanceled: false },
    });
  }

  async countCanceled(): Promise<number> {
    return this.reservationRepository.count({
      where: { isCanceled: true },
    });
  }

  async cancelReservation(concertId: string, userId: string): Promise<void> {
    const result = await this.reservationRepository.update(
      { concertId, userId, isCanceled: false },
      { isCanceled: true },
    );

    if (!result.affected) {
      throw new NotFoundException('Reservation not found');
    }
  }

  async countGroupByConcert(): Promise<Record<string, number>> {
    const result = await this.reservationRepository
      .createQueryBuilder('reservation')
      .select('reservation.concertId', 'concertId')
      .addSelect('COUNT(reservation.id)', 'count')
      .groupBy('reservation.concertId')
      .getRawMany<{ concertId: string; count: string }>();

    const map: Record<string, number> = {};

    result.forEach((row) => {
      map[row.concertId] = Number(row.count);
    });

    return map;
  }
}
