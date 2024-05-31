import { prepareTimeSlotPeriod } from './timeService';
import dayjs from 'dayjs';
import { Reservation } from '../types';

describe('prepareTimeSlotPeriod', () => {
  it('should return null start and end times if slot is not defined', () => {
    const timeSlot: Reservation = {
      id: '1',
      clientId: '1',
      providerId: '1',
      date: '2022-01-01',
      status: 'available',
    };

    const result = prepareTimeSlotPeriod(timeSlot);

    expect(result.preparedTimeSlotStart).toBeNull();
    expect(result.preparedTimeSlotEnd).toBeNull();
  });

  it('should return prepared start and end times if slot is defined', () => {
    const timeSlot: Reservation = {
      id: '1',
      clientId: '1',
      providerId: '1',
      date: '2022-01-01',
      status: 'available',
      slot: [
        {
          start: '08:00',
          end: '10:00',
        },
      ],
    };

    const result = prepareTimeSlotPeriod(timeSlot);

    expect(result.preparedTimeSlotStart).toEqual(
      dayjs('2022-01-01 08:00', 'YYYY-MM-DD HH:mm')
    );
    expect(result.preparedTimeSlotEnd).toEqual(
      dayjs('2022-01-01 10:00', 'YYYY-MM-DD HH:mm')
    );
  });
});
