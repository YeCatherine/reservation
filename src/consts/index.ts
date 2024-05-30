export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const DATE_TIME_FORMAT_LONG = 'dddd, Do of MMMM';
export const TIME_FORMAT = 'HH:mm';
export const DEFAULT_TIMEZONE = 'PST';

export const ALL_PROVIDERS = 'all_providers';

export const DEFAULT_TIMER = 30;

export enum Role {
  Provider = 'provider',
  Client = 'client',
}

/**
 * Enum for Reservation states.
 */
export enum ReservationStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  BOOKED = 'booked',
  DISABLED = 'disabled',
  // To cover 30 minutes delay.
  EXPIRED = 'expired',
  SELECTED = 'selected',
}

/**
 * Tooltip texts.
 */
export const TOOLTIP_TEXTS = {
  DISABLED: "It's not allowed to book earlier than 24 hours ahead",
  RESERVED: 'This slot is already reserved',
  BOOKED: 'This slot is already booked',
  AVAILABLE: 'Click to book',
};
