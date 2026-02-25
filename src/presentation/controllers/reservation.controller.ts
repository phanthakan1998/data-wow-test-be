import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { ReservationUseCase } from 'src/use-cases/reservation/reservation.usecase';
import { ReserveSeatDto } from '../dto/request/reservation-request.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationUseCase: ReservationUseCase) {}

  //TODO add dto
  @Get(':userId/concerts')
  async userReservations(@Param('userId') userId: string) {
    return this.reservationUseCase.getUserReservations(userId);
  }

  @Post(':id/reserve')
  async reserve(@Param('id') concertId: string, @Body() dto: ReserveSeatDto) {
    return this.reservationUseCase.reserveSeat(concertId, dto.userId);
  }

  @Delete(':id/reserve')
  async cancel(@Param('id') concertId: string, @Body() dto: ReserveSeatDto) {
    await this.reservationUseCase.cancelReservation(concertId, dto.userId);
  }
}
