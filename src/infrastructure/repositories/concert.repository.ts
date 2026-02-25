import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConcertRepositoryModel } from 'src/domain/repositories/concert.repository';
import { Concert } from 'src/domain/entities/concert.entity';
import { ConcertOrmEntity } from '../database/concert.model';

@Injectable()
export class ConcertRepository implements ConcertRepositoryModel {
  constructor(
    @InjectRepository(ConcertOrmEntity)
    private readonly concertRepository: Repository<ConcertOrmEntity>,
  ) {}

  async create(concert: Concert): Promise<Concert> {
    const entity = this.concertRepository.create(concert);
    const saved = await this.concertRepository.save(entity);

    return new Concert(
      saved.id,
      saved.name,
      saved.description,
      saved.totalSeats,
    );
  }

  async findAll(): Promise<Concert[]> {
    const data = await this.concertRepository.find();

    return data.map(
      (item) =>
        new Concert(item.id, item.name, item.description, item.totalSeats),
    );
  }

  async findById(id: string): Promise<Concert | null> {
    const item = await this.concertRepository.findOne({ where: { id } });

    if (!item) return null;

    return new Concert(item.id, item.name, item.description, item.totalSeats);
  }

  async delete(id: string): Promise<void> {
    const result = await this.concertRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Concert not found');
    }
  }

  async sumTotalSeats(): Promise<number> {
    const result = await this.concertRepository
      .createQueryBuilder('concert')
      .select('SUM(concert.totalSeats)', 'sum')
      .getRawOne<{ sum: string | null }>();

    return Number(result?.sum ?? 0);
  }
}
