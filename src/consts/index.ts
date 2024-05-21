export const DATE_TIME_FORMAT = 'YYYY-MM-DD';
export const DEFAULT_TIMEZONE = 'PST';

export const ALL_PROVIDERS = 'all';

export const DEFAULT_TIMER = 30;

export enum Role {
  Provider = 'provider',
  Client = 'client',
}

/**
 * Enum for slot states.
 */
export enum SlotState {
  Disabled = 'disabled',
  Booked = 'booked',
  Reserved = 'reserved',
  Available = 'available',
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

export enum ReservationStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  EXPIRED = 'expired',
}
