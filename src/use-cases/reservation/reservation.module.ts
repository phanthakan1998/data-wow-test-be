import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConcertOrmEntity } from 'src/infrastructure/database/concert.model';
import { ReservationOrmEntity } from 'src/infrastructure/database/reservation.model';
import { ConcertTypeOrmRepository } from 'src/infrastructure/repositories/concert.repository';
import { ReservationTypeOrmRepository } from 'src/infrastructure/repositories/reservation.repository';
import { ReservationUseCase } from './reservation.usecase';
import { ReservationController } from 'src/presentation/controllers/reservation.controller';
import { HistoryTypeOrmRepository } from 'src/infrastructure/repositories/history.repository';
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
    ConcertTypeOrmRepository,
    ReservationTypeOrmRepository,
    HistoryTypeOrmRepository,

    {
      provide: ReservationUseCase,
      useFactory: (
        concertRepository: ConcertTypeOrmRepository,
        reservationRepository: ReservationTypeOrmRepository,
        historyRepository: HistoryTypeOrmRepository,
      ) =>
        new ReservationUseCase(
          concertRepository,
          reservationRepository,
          historyRepository,
        ),
      inject: [
        ConcertTypeOrmRepository,
        ReservationTypeOrmRepository,
        HistoryTypeOrmRepository,
      ],
    },
  ],
})
export class ReservationModule {}
