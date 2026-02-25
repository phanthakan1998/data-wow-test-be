import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { ReservationUseCase } from 'src/use-cases/reservation/reservation.usecase';
import { ReserveSeatDto } from '../dto/request/reservation-request.dto';
import { IUserConsertResponseDto } from '../dto/response/reseveration-respose.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationUseCase: ReservationUseCase) {}

  @Get(':userId/concerts')
  async userReservations(
    @Param('userId') userId: string,
  ): Promise<IUserConsertResponseDto[]> {
    return this.reservationUseCase.getUserReservations(userId);
  }

  @Post('reserve')
  async reserve(@Body() dto: ReserveSeatDto): Promise<void> {
    await this.reservationUseCase.reserveSeat(dto.concertId, dto.userId);
  }

  @Patch('cancel')
  async cancel(@Body() dto: ReserveSeatDto): Promise<void> {
    await this.reservationUseCase.cancelReservation(dto.concertId, dto.userId);
  }
}
