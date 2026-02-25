import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';

import { ConcertUseCase } from 'src/use-cases/concert/concert.usecase';
import { CreateConcertDto } from '../dto/request/concert-request.dto';
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

  @Get('dashboard/summary')
  getSummary() {
    return this.concertUseCase.getDashboardSummary();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.concertUseCase.deleteConcert(id);
  }

  @Get('history')
  async getAllHisory() {
    const historyLogs = await this.concertUseCase.getHistory();
    return historyLogs;
  }
}
