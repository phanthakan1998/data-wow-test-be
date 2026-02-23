import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertOrmEntity } from 'src/infrastructure/database/concert.orm-entity';
import { ConcertTypeOrmRepository } from 'src/infrastructure/repositories/concert.typeorm.repository';
import { ConcertController } from 'src/presentation/controllers/concert.controller';
import { ConcertUseCase } from './concert.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([ConcertOrmEntity])],
  controllers: [ConcertController],
  providers: [
    ConcertTypeOrmRepository,
    {
      provide: ConcertUseCase,
      useFactory: (repo: ConcertTypeOrmRepository) => new ConcertUseCase(repo),
      inject: [ConcertTypeOrmRepository],
    },
  ],
})
export class ConcertModule {}
