import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConcertOrmEntity } from 'src/infrastructure/database/concert.model';
import { ReservationOrmEntity } from 'src/infrastructure/database/reservation.model';
import { ConcertRepository } from 'src/infrastructure/repositories/concert.repository';
import { ReservationRepository } from 'src/infrastructure/repositories/reservation.repository';
import { ReservationUseCase } from './reservation.usecase';
import { ReservationController } from 'src/presentation/controllers/reservation.controller';
import { HistoryRepository } from 'src/infrastructure/repositories/history.repository';
import { HistoryOrmEntity } from 'src/infrastructure/database/history.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConcertOrmEntity,
      ReservationOrmEntity,
      HistoryOrmEntity,
    ]),
  ],
  controllers: [ReservationController],
  providers: [
    ConcertRepository,
    ReservationRepository,
    HistoryRepository,

    {
      provide: ReservationUseCase,
      useFactory: (
        concertRepository: ConcertRepository,
        reservationRepository: ReservationRepository,
        historyRepository: HistoryRepository,
      ) =>
        new ReservationUseCase(
          concertRepository,
          reservationRepository,
          historyRepository,
        ),
      inject: [ConcertRepository, ReservationRepository, HistoryRepository],
    },
  ],
})
export class ReservationModule {}
