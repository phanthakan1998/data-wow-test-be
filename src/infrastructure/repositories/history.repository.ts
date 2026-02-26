import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryEntityModel } from '../database/history.model';
import { HistoryLog } from 'src/domain/entities/history.entity';
import { HistoryRepositoryModel } from 'src/domain/repositories/history.repository';

@Injectable()
export class HistoryRepository implements HistoryRepositoryModel {
  constructor(
    @InjectRepository(HistoryEntityModel)
    private readonly historyRepository: Repository<HistoryEntityModel>,
  ) {}

  async create(history: HistoryLog): Promise<HistoryLog> {
    const entity = this.historyRepository.create({
      id: history.id,
      concertName: history.concertName,
      userName: history.userName,
      userId: history.userId,
      action: history.action,
      createdAt: history.createdAt,
    });

    const savedResult = await this.historyRepository.save(entity);

    return new HistoryLog(
      savedResult.id,
      savedResult.concertName,
      savedResult.userName,
      savedResult.userId,
      savedResult.action,
      savedResult.createdAt,
    );
  }

  async findAll(): Promise<HistoryLog[]> {
    const records = await this.historyRepository.find({
      order: { createdAt: 'DESC' },
    });

    return records.map(
      (item) =>
        new HistoryLog(
          item.id,
          item.concertName,
          item.userName,
          item.userId,
          item.action,
          item.createdAt,
        ),
    );
  }
}
