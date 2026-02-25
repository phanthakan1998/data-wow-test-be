import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryOrmEntity } from '../database/history.model';
import { HistoryLog } from 'src/domain/entities/history.entity';
import { HistoryRepository } from 'src/domain/repositories/history.repository';

@Injectable()
export class HistoryTypeOrmRepository implements HistoryRepository {
  constructor(
    @InjectRepository(HistoryOrmEntity)
    private readonly repo: Repository<HistoryOrmEntity>,
  ) {}

  async create(history: HistoryLog): Promise<HistoryLog> {
    const entity = this.repo.create({
      id: history.id,
      concertName: history.concertName,
      userName: history.userName,
      action: history.action,
      createdAt: history.createdAt,
    });

    const saved = await this.repo.save(entity);

    return new HistoryLog(
      saved.id,
      saved.concertName,
      saved.userName,
      saved.action,
      saved.createdAt,
    );
  }

  async findAll(): Promise<HistoryLog[]> {
    const records = await this.repo.find({
      order: { createdAt: 'DESC' },
    });

    return records.map(
      (item) =>
        new HistoryLog(
          item.id,
          item.concertName,
          item.userName,
          item.action,
          item.createdAt,
        ),
    );
  }
}
