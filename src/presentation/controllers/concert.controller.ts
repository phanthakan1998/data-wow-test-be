import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';

import { ConcertUseCase } from 'src/use-cases/concert/concert.usecase';
import {
  CreateConcertDto,
  ReserveSeatDto,
} from '../dto/request/concert-request.dto';
import { ConcertResponseDto } from '../dto/response/concert-response.dto';

@Controller('concerts')
export class ConcertController {
  constructor(private readonly concertUseCase: ConcertUseCase) {}

  @Post()
  async create(@Body() dto: CreateConcertDto) {
    const concert = await this.concertUseCase.create(
      dto.name,
      dto.description,
      dto.totalSeats,
    );

    return new ConcertResponseDto(concert);
  }

  @Get()
  async findAll() {
    const concerts = await this.concertUseCase.getAll();
    return concerts.map((item) => new ConcertResponseDto(item));
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.concertUseCase.deleteConcert(id);
  }

  @Post(':id/reserve')
  async reserve(@Param('id') concertId: string, @Body() dto: ReserveSeatDto) {
    return this.concertUseCase.reserveSeat(concertId, dto.userId);
  }

  @Delete(':id/reserve')
  async cancel(@Param('id') concertId: string, @Body() dto: ReserveSeatDto) {
    await this.concertUseCase.cancelReservation(concertId, dto.userId);
  }

  @Get('users/:userId/reservations')
  async userReservations(@Param('userId') userId: string) {
    return this.concertUseCase.getUserReservations(userId);
  }

  @Get(':id/reservations')
  async concertReservations(@Param('id') concertId: string) {
    return this.concertUseCase.getConcertReservations(concertId);
  }

  @Get('/reservations/all')
  async allReservations() {
    return this.concertUseCase.getAllReservations();
  }
}
