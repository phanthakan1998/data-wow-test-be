import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';

import { ConcertUseCase } from 'src/use-cases/concert/concert.usecase';
import { CreateConcertDto } from '../dto/request/concert-request.dto';
import {
  IConcertResponseDto,
  IDashBoardResponseDto,
} from '../dto/response/concert-response.dto';
import { HistoryLog } from 'src/domain/entities/history.entity';

@Controller('concerts')
export class ConcertController {
  constructor(private readonly concertUseCase: ConcertUseCase) {}

  @Post()
  async create(@Body() req: CreateConcertDto): Promise<IConcertResponseDto> {
    const concert = await this.concertUseCase.create(
      req.name,
      req.description,
      req.totalSeats,
    );
    return concert;
  }

  @Get()
  async findAll(): Promise<IConcertResponseDto[]> {
    const concerts = await this.concertUseCase.getAll();
    return concerts;
  }

  @Get('dashboard/summary')
  getSummary(): Promise<IDashBoardResponseDto> {
    return this.concertUseCase.getDashboardSummary();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.concertUseCase.deleteConcert(id);
  }

  @Get('history')
  async getAllHisory(): Promise<HistoryLog[]> {
    const historyLogs = await this.concertUseCase.getHistory();
    return historyLogs;
  }
}
