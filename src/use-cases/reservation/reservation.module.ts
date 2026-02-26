import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConcertEntityModel } from 'src/infrastructure/database/concert.model';
import { ReservationEntityModel } from 'src/infrastructure/database/reservation.model';
import { ConcertRepository } from 'src/infrastructure/repositories/concert.repository';
import { ReservationRepository } from 'src/infrastructure/repositories/reservation.repository';
import { ReservationUseCase } from './reservation.usecase';
import { ReservationController } from 'src/presentation/controllers/reservation.controller';
import { HistoryRepository } from 'src/infrastructure/repositories/history.repository';
import { HistoryEntityModel } from 'src/infrastructure/database/history.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConcertEntityModel,
      ReservationEntityModel,
      HistoryEntityModel,
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
