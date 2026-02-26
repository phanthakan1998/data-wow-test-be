import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ReservationUseCase } from 'src/use-cases/reservation/reservation.usecase';
import { ConcertStatus } from 'src/infrastructure/common/enums/reservation';
import { ConcertRepositoryModel } from 'src/domain/repositories/concert.repository';
import { HistoryRepositoryModel } from 'src/domain/repositories/history.repository';
import { ReservationRepositoryModel } from 'src/domain/repositories/reservation.repository';

describe('ReservationUseCase', () => {
  let useCase: ReservationUseCase;

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

    useCase = new ReservationUseCase(
      concertRepository as ConcertRepositoryModel,
      reservationRepository as ReservationRepositoryModel,
      historyRepository as HistoryRepositoryModel,
    );
  });

  describe('reserveSeat', () => {
    it('should error NotFoundException when concert not found', async () => {
      concertRepository.findById.mockResolvedValue(null);

      await expect(useCase.reserveSeat('1', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should error BadRequestException when concert is full', async () => {
      concertRepository.findById.mockResolvedValue({
        id: '1',
        name: 'Concert',
        isFullyBooked: () => true,
      });

      await expect(useCase.reserveSeat('1', 'user1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should error if already reserved', async () => {
      concertRepository.findById.mockResolvedValue({
        id: '1',
        name: 'Concert',
        isFullyBooked: () => false,
      });

      reservationRepository.findByConcertAndUser.mockResolvedValue({
        isCanceled: false,
      });

      await expect(useCase.reserveSeat('1', 'user1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update reservation if last time canceled', async () => {
      concertRepository.findById.mockResolvedValue({
        id: '1',
        name: 'Concert',
        isFullyBooked: () => false,
      });

      reservationRepository.findByConcertAndUser.mockResolvedValue({
        isCanceled: true,
      });

      reservationRepository.countByConcert.mockResolvedValue(1);

      await useCase.reserveSeat('1', 'user1');

      expect(
        reservationRepository.updateReservationStatus,
      ).toHaveBeenCalledWith('1', 'user1', false);
    });

    it('should create new reservation when not existing', async () => {
      concertRepository.findById.mockResolvedValue({
        id: '1',
        name: 'Concert',
        isFullyBooked: () => false,
      });

      reservationRepository.findByConcertAndUser.mockResolvedValue(null);
      reservationRepository.countByConcert.mockResolvedValue(1);

      await useCase.reserveSeat('1', 'user1');

      expect(reservationRepository.create).toHaveBeenCalled();
      expect(historyRepository.create).toHaveBeenCalled();
    });
  });

  describe('cancelReservation', () => {
    it('should cancel reservation and create history', async () => {
      concertRepository.findById.mockResolvedValue({
        id: '1',
        name: 'Concert',
      });

      await useCase.cancelReservation('1', 'user1');

      expect(
        reservationRepository.updateReservationStatus,
      ).toHaveBeenCalledWith('1', 'user1', true);

      expect(historyRepository.create).toHaveBeenCalled();
    });

    it('should fallback to empty string if concert name undefined', async () => {
      concertRepository.findById.mockResolvedValue({
        id: '1',
        name: undefined,
      });

      await useCase.cancelReservation('1', 'user1');

      expect(historyRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          concertName: '',
        }),
      );
    });
  });

  describe('getUserReservations', () => {
    it('should return RESERVED status', async () => {
      reservationRepository.findByUser.mockResolvedValue([
        { concertId: '1', isCanceled: false },
      ]);

      concertRepository.findAll.mockResolvedValue([
        {
          id: '1',
          name: 'Concert 1',
          description: '',
          totalSeats: 10,
          isFullyBooked: () => false,
        },
      ]);

      reservationRepository.countGroupByConcert.mockResolvedValue({ '1': 1 });

      const result = await useCase.getUserReservations('user1');

      expect(result[0].status).toBe(ConcertStatus.RESERVED);
    });

    it('should return CANCELED status', async () => {
      reservationRepository.findByUser.mockResolvedValue([
        { concertId: '1', isCanceled: true },
      ]);

      concertRepository.findAll.mockResolvedValue([
        {
          id: '1',
          name: 'Concert 1',
          description: '',
          totalSeats: 10,
          isFullyBooked: () => false,
        },
      ]);

      reservationRepository.countGroupByConcert.mockResolvedValue({ '1': 1 });

      const result = await useCase.getUserReservations('user1');

      expect(result[0].status).toBe(ConcertStatus.CANCELED);
    });

    it('should return FULL when concert is full', async () => {
      reservationRepository.findByUser.mockResolvedValue([]);

      concertRepository.findAll.mockResolvedValue([
        {
          id: '1',
          name: 'Concert 1',
          description: '',
          totalSeats: 1,
          isFullyBooked: () => true,
        },
      ]);

      reservationRepository.countGroupByConcert.mockResolvedValue({ '1': 1 });

      const result = await useCase.getUserReservations('user1');

      expect(result[0].status).toBe(ConcertStatus.FULL);
    });

    it('should return AVAILABLE when no reservation and not full', async () => {
      reservationRepository.findByUser.mockResolvedValue([]);

      concertRepository.findAll.mockResolvedValue([
        {
          id: '1',
          name: 'Concert 1',
          description: '',
          totalSeats: 10,
          isFullyBooked: () => false,
        },
      ]);

      reservationRepository.countGroupByConcert.mockResolvedValue({});

      const result = await useCase.getUserReservations('user1');

      expect(result[0].status).toBe(ConcertStatus.AVAILABLE);
    });
  });
});
