import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationRepository } from 'src/domain/repositories/reservation.repository';
import { Reservation } from 'src/domain/entities/reservation.entity';
import { ReservationOrmEntity } from '../database/reservation.model';

@Injectable()
export class ReservationTypeOrmRepository implements ReservationRepository {
  constructor(
    @InjectRepository(ReservationOrmEntity)
    private readonly repo: Repository<ReservationOrmEntity>,
  ) {}

  async findAll(): Promise<Reservation[]> {
    const data = await this.repo.find();

    return data.map(
      (item) => new Reservation(item.id, item.concertId, item.userId),
    );
  }

  async create(reservation: Reservation): Promise<Reservation> {
    const orm = this.repo.create({
      id: reservation.id,
      concertId: reservation.concertId,
      userId: reservation.userId,
    });

    const saved = await this.repo.save(orm);

    return new Reservation(saved.id, saved.concertId, saved.userId);
  }

  async deleteByConcertAndUser(
    concertId: string,
    userId: string,
  ): Promise<void> {
    const result = await this.repo.delete({
      concertId,
      userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Reservation not found');
    }
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    const data = await this.repo.find({
      where: { userId },
    });

    return data.map(
      (item) => new Reservation(item.id, item.concertId, item.userId),
    );
  }

  async findByConcert(concertId: string): Promise<Reservation[]> {
    const data = await this.repo.find({
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
    const item = await this.repo.findOne({
      where: { concertId, userId },
    });

    if (!item) return null;

    return new Reservation(item.id, item.concertId, item.userId);
  }

  async countByConcert(concertId: string): Promise<number> {
    return this.repo.count({
      where: { concertId },
    });
  }
  async countActive(): Promise<number> {
    return this.repo.count({
      where: { isCanceled: false },
    });
  }

  async countCanceled(): Promise<number> {
    return this.repo.count({
      where: { isCanceled: true },
    });
  }

  async cancelReservation(concertId: string, userId: string): Promise<void> {
    const result = await this.repo.update(
      { concertId, userId, isCanceled: false },
      { isCanceled: true },
    );

    if (!result.affected) {
      throw new NotFoundException('Reservation not found');
    }
  }

  async countGroupByConcert(): Promise<Record<string, number>> {
    const result = await this.repo
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
