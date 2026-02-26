import { ConcertUseCase } from './concert.usecase';
import { Concert } from 'src/domain/entities/concert.entity';
import { Reservation } from 'src/domain/entities/reservation.entity';
import { HistoryLog } from 'src/domain/entities/history.entity';
import { HistoryAction } from 'src/infrastructure/common/enums/history';

import { ReservationRepositoryModel } from 'src/domain/repositories/reservation.repository';
import { HistoryRepositoryModel } from 'src/domain/repositories/history.repository';
import { ConcertRepositoryModel } from 'src/domain/repositories/concert.repository';

describe('ConcertUseCase', () => {
  let useCase: ConcertUseCase;

  const concertRepository = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    sumTotalSeats: jest.fn(),
  };

  const reservationRepository = {
    findAll: jest.fn(),
    create: jest.fn(),
    findByUser: jest.fn(),
    findByConcert: jest.fn(),
    findByConcertAndUser: jest.fn(),
    countByConcert: jest.fn(),
    countByStatus: jest.fn(),
    countGroupByConcert: jest.fn(),
    updateReservationStatus: jest.fn(),
    deleteByConcert: jest.fn(),
  };

  const historyRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new ConcertUseCase(
      concertRepository as ConcertRepositoryModel,
      reservationRepository as ReservationRepositoryModel,
      historyRepository as HistoryRepositoryModel,
    );
  });

  it('should create a concert', async () => {
    const mockConcert = new Concert('uuid', 'Test', 'Desc', 100);

    concertRepository.create.mockResolvedValue(mockConcert);

    const result = await useCase.create('Test', 'Desc', 100);

    expect(concertRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test',
        description: 'Desc',
        totalSeats: 100,
      }),
    );
    expect(result).toEqual(mockConcert);
  });

  it('should return all concerts', async () => {
    const concerts = [new Concert('1', 'A', 'B', 50)];

    concertRepository.findAll.mockResolvedValue(concerts);

    const result = await useCase.getAll();

    expect(concertRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(concerts);
  });

  it('should delete concert and its reservations', async () => {
    reservationRepository.deleteByConcert.mockResolvedValue(undefined);
    concertRepository.delete.mockResolvedValue(undefined);

    await useCase.deleteConcert('111111');

    expect(reservationRepository.deleteByConcert).toHaveBeenCalledWith(
      '111111',
    );
    expect(concertRepository.delete).toHaveBeenCalledWith('111111');
  });

  it('should return all reservations', async () => {
    const reservations = [new Reservation('1', 'concertId', 'John', false)];

    reservationRepository.findAll.mockResolvedValue(reservations);

    const result = await useCase.getAllReservations();

    expect(reservationRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(reservations);
  });

  it('should return dashboard summary', async () => {
    concertRepository.sumTotalSeats.mockResolvedValue(500);

    reservationRepository.countByStatus
      .mockResolvedValueOnce(300)
      .mockResolvedValueOnce(50);

    const result = await useCase.getDashboardSummary();

    expect(concertRepository.sumTotalSeats).toHaveBeenCalled();
    expect(reservationRepository.countByStatus).toHaveBeenCalledWith(false);
    expect(reservationRepository.countByStatus).toHaveBeenCalledWith(true);

    expect(result).toEqual({
      totalSeats: 500,
      totalReserved: 300,
      totalCanceled: 50,
    });
  });

  it('should return history logs', async () => {
    const history = [
      new HistoryLog(
        '1',
        'Concert Name',
        'User Name',
        'user-id',
        HistoryAction.RESERVE,
        new Date(),
      ),
    ];

    historyRepository.findAll.mockResolvedValue(history);

    const result = await useCase.getHistory();

    expect(historyRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(history);
  });
});
