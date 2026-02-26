import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConcertUseCase } from './concert.usecase';
import { ConcertEntityModel } from 'src/infrastructure/database/concert.model';
import { ReservationEntityModel } from 'src/infrastructure/database/reservation.model';
import { ConcertRepository } from 'src/infrastructure/repositories/concert.repository';
import { ReservationRepository } from 'src/infrastructure/repositories/reservation.repository';
import { ConcertController } from 'src/presentation/controllers/concert.controller';
import { HistoryEntityModel } from 'src/infrastructure/database/history.model';
import { HistoryRepository } from 'src/infrastructure/repositories/history.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConcertEntityModel,
      ReservationEntityModel,
      HistoryEntityModel,
    ]),
  ],
  controllers: [ConcertController],
  providers: [
    ConcertRepository,
    ReservationRepository,
    HistoryRepository,
    {
      provide: ConcertUseCase,
      useFactory: (
        concertRepo: ConcertRepository,
        reservationRepo: ReservationRepository,
        historyRepository: HistoryRepository,
      ) => new ConcertUseCase(concertRepo, reservationRepo, historyRepository),
      inject: [ConcertRepository, ReservationRepository, HistoryRepository],
    },
  ],
})
export class ConcertModule {}
