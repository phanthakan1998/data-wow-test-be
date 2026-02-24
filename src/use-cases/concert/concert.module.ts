import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConcertUseCase } from './concert.usecase';
import { ConcertOrmEntity } from 'src/infrastructure/database/concert.orm-entity';
import { ReservationOrmEntity } from 'src/infrastructure/database/reservation.orm-entity';
import { ConcertTypeOrmRepository } from 'src/infrastructure/repositories/concert.repository';
import { ReservationTypeOrmRepository } from 'src/infrastructure/repositories/reservation.repository';
import { ConcertController } from 'src/presentation/controllers/concert.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConcertOrmEntity, ReservationOrmEntity])],
  controllers: [ConcertController],
  providers: [
    ConcertTypeOrmRepository,
    ReservationTypeOrmRepository,
    {
      provide: ConcertUseCase,
      useFactory: (
        concertRepo: ConcertTypeOrmRepository,
        reservationRepo: ReservationTypeOrmRepository,
      ) => new ConcertUseCase(concertRepo, reservationRepo),
      inject: [ConcertTypeOrmRepository, ReservationTypeOrmRepository],
    },
  ],
})
export class ConcertModule {}
