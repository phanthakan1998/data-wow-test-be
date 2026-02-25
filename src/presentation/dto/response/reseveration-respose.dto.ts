import { ConcertStatus } from 'src/infrastructure/common/enums/reservation';

export interface IUserConsertResponseDto {
  id: string;
  name: string;
  description: string;
  totalSeats: number;
  status: ConcertStatus;
}

export interface IReserveSeatResponseDto {
  id: string;
  concertId: string;
  userId: string;
}
