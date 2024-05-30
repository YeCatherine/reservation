import { Dayjs } from 'dayjs';

export type TReservationStatus =
  | 'available'
  | 'reserved'
  | 'booked'
  | 'disabled'
  | 'expired';

export interface Slot {
  id?: string;
  start: Dayjs | string;
  end: Dayjs | string;
  status?: TReservationStatus;
  timezone?: string;
  /**
   * List of available providers for the slot with status 'available'.
   */
  availableProviders?: string[];
}

export interface Reservation {
  id: string;
  clientId: string;
  providerId: string | number;
  date: string;
  // @todo merge to 1 param
  slot?: Slot;
  timer?: number | null;
  status: TReservationStatus;
  expirationTime?: Dayjs | string;
}

export interface Provider {
  // id: number | string;
  id: string;
  name: string;
  schedules: Reservation[];
  availability: Reservation[];
}

export interface User {
  id: string;
  name: string;
  role: string;
}
