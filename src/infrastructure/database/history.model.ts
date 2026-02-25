import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { HistoryAction } from '../common/enums/history';

@Entity({ name: 'history' })
export class HistoryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 150 })
  concertName: string;

  @Column({ type: 'varchar' })
  userName: string;

  @Column({ type: 'varchar' })
  action: HistoryAction;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;
}
