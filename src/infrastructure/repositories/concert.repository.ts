import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConcertRepository } from 'src/domain/repositories/concert.repository';
import { Concert } from 'src/domain/entities/concert.entity';
import { ConcertOrmEntity } from '../database/concert.orm-entity';

@Injectable()
export class ConcertTypeOrmRepository implements ConcertRepository {
  constructor(
    @InjectRepository(ConcertOrmEntity)
    private readonly repo: Repository<ConcertOrmEntity>,
  ) {}

  async create(concert: Concert): Promise<Concert> {
    const entity = this.repo.create(concert);
    const saved = await this.repo.save(entity);

    return new Concert(
      saved.id,
      saved.name,
      saved.description,
      saved.totalSeats,
    );
  }

  async findAll(): Promise<Concert[]> {
    const data = await this.repo.find();

    return data.map(
      (item) =>
        new Concert(item.id, item.name, item.description, item.totalSeats),
    );
  }

  async findById(id: string): Promise<Concert | null> {
    const item = await this.repo.findOne({ where: { id } });

    if (!item) return null;

    return new Concert(item.id, item.name, item.description, item.totalSeats);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Concert not found');
    }
  }
}
