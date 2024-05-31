# Scheduling App

## Overview

This scheduling app is built using modern technologies to provide an efficient and user-friendly experience for both
providers and clients.

## Tech Stack

- **React**
- **TypeScript**
- **Material-UI (MUI)**
- **Dayjs with timezones**
- **Vite**
- **Storybook**

## Helping Tools

- **Prettier**
- **Husky**
- **ESLint**
- **Lint Staged**
- **Playwright**

## How to Run the App

### User Credentials

To test the app, use the following demo user credentials:

- **Provider User**
  - Username: `provider1`
  - Password: `provider1`
- **Client User**
  - Username: `client1`
  - Password: `client1`

### Access Instructions

1. **Provider Page Access**

   - Navigate to `/provider` page.
   - Log in with the provider credentials (`provider1`).
   - Click on any date and select a time.
   - The form will suggest a default time.
   - Available dates will be displayed on the calendar.

2. **Client Page Access**
   - Navigate to `/client` page.
   - Log in with either provider (`provider1`) or client (`client1`) credentials.
   - Click on any date and select a time.
   - The slot will be blocked for 30 minutes and will not be available for other users.
   - You can cancel a booking by clicking on the slot.
   - You can book only one slot per iteration.
   - You can delete booked slots by clicking on the slot.

**Note:** To test that the provider page has restricted access, try logging in with `client1` credentials; you will be
redirected to the `/login` page.

## Technical Details

- **Context Providers:** Utilized for authentication, providers, reservations, and dates.
- **Libraries and Solutions:** Reused popular libraries for error handling, base layout (theme), routing, and debugging
  components.
- **Testing:** Added Playwright tests for main components.
- **Design:** Used corporate colors for the light theme.
- **API Emulation:** Used Mirage to emulate API interactions.

## Future Plans

If given more time, the following features and improvements would be added:

1. **Full Multi-timezone Support**
2. **GraphQL Integration**
3. **TypeScript Strict Mode**
4. **Storybook Integration**
5. **More Tests with Visual Snapshots**
6. **CI/CD Pipeline**
7. **Display Booked Slots in Provider Calendar**
8. **Recurring Booking Functionality**
9. **Internationalization (i18n) Support for Languages and Date Formats**
10. **Typedoc for Documentation**
11. **Multi-browser and Device Support**
12. **PWA Features:** Offline mode, push notifications, and mobile-friendly features.
