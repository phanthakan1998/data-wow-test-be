export interface IConcertResponseDto {
  id: string;
  name: string;
  description: string;
  totalSeats: number;
}

export interface IDashBoardResponseDto {
  totalSeats: number;
  totalReserved: number;
  totalCanceled: number;
}
