import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertModule } from './use-cases/concert/concert.module';
import { ConfigModule } from '@nestjs/config';
import { ReservationModule } from './use-cases/reservation/reservation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'db',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_DATABASE || 'concert_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConcertModule,
    ReservationModule,
  ],
})
export class AppModule {}
