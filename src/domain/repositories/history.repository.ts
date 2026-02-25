import { HistoryLog } from '../entities/history.entity';

export interface HistoryRepositoryModel {
  create(history: HistoryLog): Promise<HistoryLog>;
  findAll(): Promise<HistoryLog[]>;
}
