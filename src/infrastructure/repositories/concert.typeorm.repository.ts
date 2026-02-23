import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcertRepository } from 'src/domain/repositories/concert.repository';
import { Repository } from 'typeorm';
import { ConcertOrmEntity } from '../database/concert.orm-entity';
import { Concert } from 'src/domain/entities/concert.entity';

@Injectable()
export class ConcertTypeOrmRepository implements ConcertRepository {
  constructor(
    @InjectRepository(ConcertOrmEntity)
    private readonly repo: Repository<ConcertOrmEntity>,
  ) {}

  async create(concert: Concert): Promise<Concert> {
    const createConcert = this.repo.create(concert);
    const concertData = await this.repo.save(createConcert);

    return new Concert(
      concertData.id,
      concertData.name,
      concertData.description,
      concertData.totalSeats,
    );
  }

  async findAll(): Promise<Concert[]> {
    const data = await this.repo.find();

    return data.map(
      (item) =>
        new Concert(item.id, item.name, item.description, item.totalSeats),
    );
  }
}
