import { HistoryAction } from 'src/infrastructure/common/enums/history';

export class HistoryLog {
  constructor(
    public readonly id: string,
    public concertName: string,
    public userName: string,
    public action: HistoryAction,
    public createdAt: Date,
  ) {}
}
