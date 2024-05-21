import { Dayjs } from 'dayjs';

export type TReservationStatus =
  | 'available'
  | 'pending'
  | 'confirmed'
  | 'expired';

export interface Slot {
  id?: string;
  start: string;
  end: string;
  status?: 'available' | 'reserved' | 'booked';
  timezone?: string;
  disabled?: boolean;
  selected?: boolean;
  reserved?: number;
  booked?: boolean;
}

export interface Schedule {
  date: string;
  slots: Slot[];
  timezone?: string;
  timer?: number | null;
}

export interface Availability {
  date: string;
  start: string;
  end: string;
  timezone?: string;
  timeSlots: Slot[];
  selectedDays?: boolean[];
}

export interface Provider {
  id: number | string;
  name: string;
  schedules: Schedule[];
  availability: Availability[];
}

export interface SubmittedSchedule {
  date: string;
  slot: Slot;
  timezone?: string;
  timer?: number | null;
}

export interface TimeSlot {
  id?: string;
  start: Dayjs | string | null;
  end: Dayjs | string | null;
  timezone?: string;
  status: 'available' | 'booked' | 'reserved';
  // Providers id available at this time slot.
  availableProviders: string[];
}

export interface DateRange {
  start: Dayjs | null;
  end: Dayjs | null;
}

export interface Reservation {
  id: number;
  clientId: number;
  providerId: string | number;
  date: string;
  slot: Slot;
  timer?: number | null;
  status: TReservationStatus;
  expirationTime: string;
}
