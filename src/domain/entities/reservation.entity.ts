export class Reservation {
  constructor(
    public readonly id: string,
    public readonly concertId: string,
    public readonly userId: string,
  ) {}
}
