import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationRepositoryModel } from 'src/domain/repositories/reservation.repository';
import { Reservation } from 'src/domain/entities/reservation.entity';
import { ReservationEntityModel } from '../database/reservation.model';

@Injectable()
export class ReservationRepository implements ReservationRepositoryModel {
  constructor(
    @InjectRepository(ReservationEntityModel)
    private readonly reservationRepository: Repository<ReservationEntityModel>,
  ) {}

  async findAll(): Promise<Reservation[]> {
    const data = await this.reservationRepository.find();

    return data.map(
      (item) =>
        new Reservation(item.id, item.concertId, item.userId, item.isCanceled),
    );
  }

  async countByStatus(isCanceled: boolean): Promise<number> {
    return this.reservationRepository.count({
      where: { isCanceled },
    });
  }

  async create(reservation: Reservation): Promise<Reservation> {
    const model = this.reservationRepository.create({
      id: reservation.id,
      concertId: reservation.concertId,
      userId: reservation.userId,
    });

    const savedResult = await this.reservationRepository.save(model);

    return new Reservation(
      savedResult.id,
      savedResult.concertId,
      savedResult.userId,
      savedResult.isCanceled,
    );
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    const data = await this.reservationRepository.find({
      where: { userId },
    });

    return data.map(
      (item) =>
        new Reservation(item.id, item.concertId, item.userId, item.isCanceled),
    );
  }

  async findByConcert(concertId: string): Promise<Reservation[]> {
    const data = await this.reservationRepository.find({
      where: { concertId },
    });

    return data.map(
      (item) =>
        new Reservation(item.id, item.concertId, item.userId, item.isCanceled),
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

    return new Reservation(
      item.id,
      item.concertId,
      item.userId,
      item.isCanceled,
    );
  }

  async countByConcert(concertId: string): Promise<number> {
    return this.reservationRepository.count({
      where: {
        concertId,
        isCanceled: false,
      },
    });
  }
  async updateReservationStatus(
    concertId: string,
    userId: string,
    isCanceled: boolean,
  ): Promise<void> {
    const result = await this.reservationRepository.update(
      { concertId, userId },
      { isCanceled },
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
      .where('reservation.isCanceled = :isCanceled', {
        isCanceled: false,
      })
      .groupBy('reservation.concertId')
      .getRawMany<{ concertId: string; count: string }>();

    const map: Record<string, number> = {};

    result.forEach((row) => {
      map[row.concertId] = Number(row.count);
    });

    return map;
  }

  async deleteByConcert(concertId: string): Promise<void> {
    await this.reservationRepository.delete({ concertId });
  }
}
