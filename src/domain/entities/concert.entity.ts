export class Concert {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public totalSeats: number,
  ) {}

  isFullyBooked(reservedCount: number): boolean {
    return reservedCount >= this.totalSeats;
  }
}
