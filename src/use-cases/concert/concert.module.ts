import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConcertUseCase } from './concert.usecase';
import { ConcertOrmEntity } from 'src/infrastructure/database/concert.model';
import { ReservationOrmEntity } from 'src/infrastructure/database/reservation.model';
import { ConcertTypeOrmRepository } from 'src/infrastructure/repositories/concert.repository';
import { ReservationTypeOrmRepository } from 'src/infrastructure/repositories/reservation.repository';
import { ConcertController } from 'src/presentation/controllers/concert.controller';
import { HistoryOrmEntity } from 'src/infrastructure/database/history.model';
import { HistoryTypeOrmRepository } from 'src/infrastructure/repositories/history.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConcertOrmEntity,
      ReservationOrmEntity,
      HistoryOrmEntity,
    ]),
  ],
  controllers: [ConcertController],
  providers: [
    ConcertTypeOrmRepository,
    ReservationTypeOrmRepository,
    HistoryTypeOrmRepository,
    {
      provide: ConcertUseCase,
      useFactory: (
        concertRepo: ConcertTypeOrmRepository,
        reservationRepo: ReservationTypeOrmRepository,
        historyRepository: HistoryTypeOrmRepository,
      ) => new ConcertUseCase(concertRepo, reservationRepo, historyRepository),
      inject: [
        ConcertTypeOrmRepository,
        ReservationTypeOrmRepository,
        HistoryTypeOrmRepository,
      ],
    },
  ],
})
export class ConcertModule {}
