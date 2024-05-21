import { createServer, Model, Response } from 'miragejs';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import {
  Provider,
  Reservation,
  Schedule,
  Slot,
  SubmittedSchedule,
} from '../types';
import {
  DATE_TIME_FORMAT,
  DEFAULT_TIMEZONE,
  ReservationStatus,
} from '../consts';

/**
 * Mirage js sever to emulate server on dev mode.
 */
export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    models: {
      provider: Model.extend<Partial<Provider>>({}),
      user: Model,
      reservation: Model.extend<Partial<Reservation>>({}),
      schedule: Model.extend<Partial<Schedule>>({}),
      slot: Model.extend<Partial<Slot>>({}),
    },

    seeds(server) {
      server.create('user', {
        id: nanoid(),
        name: 'client1',
        password: 'client1',
        role: 'client',
      });
      server.create('user', {
        id: nanoid(),
        name: 'client2',
        password: 'client2',
        role: 'client',
      });
      server.create('user', {
        id: nanoid(),
        name: 'provider1',
        password: 'provider1',
        role: 'provider',
      });
      server.create('user', {
        id: nanoid(),
        name: 'provider2',
        password: 'provider2',
        role: 'provider',
      });

      server.create('reservation', {
        id: nanoid(),
        clientId: 'client1',
        providerId: 'provider1',
        date: dayjs().add(1, 'day').format(DATE_TIME_FORMAT),
        slot: {
          start: '08:15',
          end: '08:30',
        },
        status: ReservationStatus.CONFIRMED,
      });
      server.create('reservation', {
        id: nanoid(),
        clientId: 'client2',
        providerId: 'provider1',
        date: dayjs().add(1, 'day').format(DATE_TIME_FORMAT),
        slot: {
          start: '09:30',
          end: '09:45',
        },
        status: ReservationStatus.PENDING,
      });
      server.create('reservation', {
        id: nanoid(),
        clientId: 'client2',
        providerId: 'provider1',
        date: dayjs().add(1, 'day').format(DATE_TIME_FORMAT),
        slot: {
          start: '10:30',
          end: '10:45',
        },
        status: ReservationStatus.PENDING,
      });
      server.create('provider', {
        id: 'provider1',
        name: 'Provider A',
        availability: [
          {
            date: dayjs().format(DATE_TIME_FORMAT),
            timezone: 'PST',
            start: '08:00',
            end: '15:00',
          },
          {
            date: dayjs().add(1, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            start: '08:00',
            end: '15:00',
          },
          {
            date: dayjs().add(2, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            start: '08:00',
            end: '15:00',
          },
          {
            date: dayjs().add(10, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            start: '08:00',
            end: '15:00',
          },
        ],
        schedules: [
          {
            date: dayjs().add(-3, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            slots: [
              {
                start: '08:00',
                end: '08:15',
              },
              { start: '09:00', end: '09:15' },
              { start: '11:00', end: '11:15', booked: true },
            ],
          },
          {
            date: dayjs().add(-2, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            slots: [
              {
                start: '08:00',
                end: '08:15',
              },
              { start: '09:00', end: '09:15' },
              { start: '11:00', end: '11:15', booked: true },
            ],
          },
          {
            date: dayjs().add(1, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            slots: [
              {
                start: '08:00',
                end: '08:15',
              },
              { start: '09:00', end: '09:15' },
              { start: '11:00', end: '11:15', booked: true },
            ],
          },
          {
            date: dayjs().add(3, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            slots: [
              {
                start: '08:00',
                end: '08:15',
                reserved: dayjs()
                  .add(-2, 'minutes')
                  .tz(DEFAULT_TIMEZONE)
                  .unix(),
              },
              { start: '09:00', end: '09:15' },
              { start: '11:00', end: '11:15', booked: true },
            ],
          },
        ],
      });

      server.create('provider', {
        id: 'provider2',
        name: 'Provider B',
        availability: [
          {
            date: dayjs().format(DATE_TIME_FORMAT),
            timezone: 'PST',
            start: '09:00',
            end: '15:00',
          },
          {
            date: dayjs().add(1, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            start: '08:00',
            end: '15:00',
          },
          {
            date: dayjs().add(2, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            start: '10:00',
            end: '15:00',
          },
          {
            date: dayjs().add(3, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            start: '08:00',
            end: '14:00',
          },
          {
            date: dayjs().add(4, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            start: '08:00',
            end: '15:00',
          },
        ],
        schedules: [
          {
            date: dayjs().add(-3, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            slots: [
              {
                start: '08:00',
                end: '08:15',
              },
              { start: '09:00', end: '09:15' },
              { start: '11:00', end: '11:15', booked: true },
            ],
          },
          {
            date: dayjs().add(-2, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            slots: [
              {
                start: '08:00',
                end: '08:15',
              },
              { start: '09:00', end: '09:15' },
              { start: '11:00', end: '11:15', booked: true },
            ],
          },
          {
            date: dayjs().add(1, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            slots: [
              {
                start: '08:00',
                end: '08:15',
              },
              { start: '09:00', end: '09:15' },
              { start: '11:00', end: '11:15', booked: true },
            ],
          },
          {
            date: dayjs().add(3, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            slots: [
              {
                start: '08:00',
                end: '08:15',
                reserved: dayjs()
                  .add(-2, 'minutes')
                  .tz(DEFAULT_TIMEZONE)
                  .unix(),
              },
              { start: '09:00', end: '09:15' },
              { start: '11:00', end: '11:15', booked: true },
            ],
          },
        ],
      });
    },

    routes() {
      this.namespace = 'api';
      const providerAvailability = {};
      this.get('/providers', (schema) => {
        return schema.providers.all().models;
      });

      this.get('/providers/:id', (schema, request) => {
        const id = request.params.id;
        return schema.providers.find(id);
      });

      this.get('/providers/:id/availability', (schema, request) => {
        const id = request.params.id;
        if (id === 'any') {
          const providers = schema.providers.all().models;
          providers.forEach((provider) => {
            if (!providerAvailability[provider.id]) {
              providerAvailability[provider.id] = provider.availability;
            }
          });

          return providerAvailability;
        }
        const provider = schema.providers.findBy({ id });
        if (provider) {
          if (providerAvailability[provider.id]) {
            return providerAvailability[provider.id];
          }
          providerAvailability[provider.id] = provider.availability;
          return provider.availability;
        } else {
          return new Response(
            404,
            { some: 'header' },
            { error: 'Provider not found' }
          );
        }
      });

      this.post('/providers/:id/availability', (schema, request) => {
        const id = request.params.id;

        const attrs = JSON.parse(request.requestBody);
        const provider = schema.providers.findBy({ id });

        if (provider) {
          // Check for duplicates
          const existingSlotIndex = provider.availability.findIndex(
            (slot) => slot.date === attrs.date
          );

          if (existingSlotIndex === -1) {
            // No duplicate found, add new availability
            provider.update({
              availability: [...provider.availability, attrs],
            });
          } else {
            // Duplicate found, update existing availability
            provider.availability[existingSlotIndex] = attrs;
            provider.update({
              availability: provider.availability,
            });
          }

          providerAvailability[provider.id] = provider.availability.sort(
            (a, b) => {
              return dayjs(a.date).unix() - dayjs(b.date).unix();
            }
          );
          // console.log('updated', provider.availability);
          return provider.availability;
        } else {
          return new Response(
            404,
            { some: 'header' },
            { error: 'Provider not found' }
          );
        }
      });

      this.delete('/providers/:id/availability/:date', (schema, request) => {
        const id = request.params.id;
        const date = request.params.date;

        const provider = schema.providers.findBy({ id });

        if (provider) {
          provider.update({
            availability: provider.availability.filter((a) => a.date !== date),
          });

          providerAvailability[provider.id] = provider.availability;
          return provider.availability;
        } else {
          return new Response(
            404,
            { some: 'header' },
            { error: 'Provider not found' }
          );
        }
      });

      // this.post('/reservations', (schema, request) => {
      //   let attrs = JSON.parse(request.requestBody);
      //   return schema.reservations.create(attrs);
      // });
      //
      // this.get('/reservations', (schema) => {
      //   return schema.reservations.all();
      // });

      this.get('/schedules', (schema) => {
        const schedules = schema.schedules.all().models;
        return schedules;
      });

      this.post('/schedules', (schema, request) => {
        const attrs: SubmittedSchedule[] = JSON.parse(request.requestBody);

        // Clear existing schedules before creating new ones
        schema.schedules.all().destroy();

        // Create new schedules
        attrs.forEach((schedule) => {
          schema.schedules.create(schedule);
        });

        return schema.schedules.all().models;
      });

      this.get('/reservations', (schema, request) => {
        // add possibility to search by date;
        const { date } = request.queryParams;
        if (date) {
          return schema.reservations.where((r) => r.date === date);
        } else {
          return schema.reservations.all();
        }
      });

      //
      // this.get('/reservations', (schema, request) => {
      //   let { userId, providerId } = request.queryParams;
      //   let reservations = schema.reservations.all().models;
      //
      //   if (userId) {
      //     reservations = reservations.filter(reservation => reservation.clientId == userId);
      //   }
      //   if (providerId) {
      //     reservations = reservations.filter(reservation => reservation.providerId == providerId);
      //   }
      //
      //   return { reservations };
      // });

      this.post('/reservations', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.reservations.create(attrs);
      });

      this.patch('/reservations/:id', (schema, request) => {
        const newAttrs = JSON.parse(request.requestBody);
        const id = request.params.id;
        const reservation = schema.reservations.find(id);
        return reservation.update(newAttrs);
      });

      this.del('/reservations/:id', (schema, request) => {
        const id = request.params.id;
        return schema.reservations.find(id).destroy();
      });

      this.post('/auth/login', (schema, request) => {
        try {
          const { name, password } = JSON.parse(request.requestBody);

          const user = schema.users.findBy({ name, password });
          if (user) {
            return new Response(
              200,
              {},
              { user: { ...user.attrs, token: nanoid() } }
            );
          } else {
            return new Response(
              401,
              {},
              { error: 'Invalid email or password' }
            );
          }
        } catch (e) {
          console.log(e);
          return new Response(500, {}, { error: 'Internal Server Error' });
        }
      });
    },
  });
}
