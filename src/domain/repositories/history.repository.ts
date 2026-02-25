import { HistoryLog } from '../entities/history.entity';

export interface HistoryRepository {
  create(history: HistoryLog): Promise<HistoryLog>;
  findAll(): Promise<HistoryLog[]>;
}
