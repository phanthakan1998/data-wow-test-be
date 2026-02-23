import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateConcertDto } from '../dto/request/create-concert.dto';
import { ConcertResponseDto } from '../dto/response/concert-response.dto';
import { ConcertUseCase } from 'src/use-cases/concert/concert.usecase';

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
}
