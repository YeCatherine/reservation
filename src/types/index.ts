import { Dayjs } from 'dayjs';

export interface Slot {
  start: string;
  end: string;
  timezone?: string;
  reserved?: number; // will store reservation time
  booked?: boolean;
}

export interface Schedule {
  date: string;
  slots: Slot[];
  timezone?: string;
  timer?: number | null;
}

// dateRange?: DateRange;
export interface Availability {
  date: string;
  start: string;
  end: string;
  timezone?: string;
  timeSlots: Slot[];

  selectedDays?: boolean[];
}

export interface Provider {
  id: number;
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
  start: Dayjs | null;
  end: Dayjs | null;
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
  status: 'pending' | 'confirmed' | 'expired';
  expirationTime: string;
}
