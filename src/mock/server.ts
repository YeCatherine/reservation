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
import { DATE_TIME_FORMAT, DEFAULT_TIMEZONE } from '../consts';

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

      server.create('provider', {
        id: 'provider1',
        name: 'Provider A',
        availability: [
          { date: dayjs().format(DATE_TIME_FORMAT), timezone: 'PST', start: '08:00', end: '15:00' },
          { date: dayjs().add(1, 'day').format(DATE_TIME_FORMAT), timezone: 'PST', start: '08:00', end: '15:00' },
          { date: dayjs().add(10, 'day').format(DATE_TIME_FORMAT), timezone: 'PST', start: '08:00', end: '15:00' },
        ],
        schedules: [
          {
            date: dayjs().add(-3, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            slots: [
              { start: '08:00', end: '08:15' },
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
          { date: dayjs().format(DATE_TIME_FORMAT), timezone: 'PST', start: '09:00', end: '15:00' },
          { date: dayjs().add(3, 'day').format(DATE_TIME_FORMAT), timezone: 'PST', start: '08:00', end: '14:00' },
          { date: dayjs().add(4, 'day').format(DATE_TIME_FORMAT), timezone: 'PST', start: '08:00', end: '15:00' },
        ],
        schedules: [
          {
            date: dayjs().add(-3, 'day').format(DATE_TIME_FORMAT),
            timezone: 'PST',
            slots: [
              { start: '08:00', end: '08:15' },
              { start: '09:00', end: '09:15' },
              { start: '11:00', end: '11:15', booked: true },
            ],
          },
        ],
      });
    },

    routes() {
      this.namespace = 'api';

      this.get('/providers', (schema) => {
        return schema.providers.all().models;
      });

      this.get('/providers/:id', (schema, request) => {
        let id = request.params.id;
        return schema.providers.find(id);
      });

      this.get('/providers/:id/availability', (schema, request) => {
        let id = request.params.id;
        const provider = schema.providers.findBy({ id });
        if (provider) {
          return provider.availability;
        } else {
          return new Response(404, {}, { error: 'Provider not found' });
        }
      });

      this.post('/providers/:id/availability', (schema, request) => {
        let id = request.params.id;
        let attrs = JSON.parse(request.requestBody);
        const provider = schema.providers.findBy({ id });

        if (provider) {
          const existingSlotIndex = provider.availability.findIndex((slot) => slot.date === attrs.date);
          if (existingSlotIndex === -1) {
            provider.update({ availability: [...provider.availability, attrs] });
          } else {
            provider.availability[existingSlotIndex] = attrs;
            provider.update({ availability: provider.availability });
          }
          return provider.availability.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
        } else {
          return new Response(404, {}, { error: 'Provider not found' });
        }
      });

      this.delete('/providers/:id/availability/:date', (schema, request) => {
        let id = request.params.id;
        let date = request.params.date;
        const provider = schema.providers.findBy({ id });

        if (provider) {
          provider.update({ availability: provider.availability.filter((a) => a.date !== date) });
          return provider.availability;
        } else {
          return new Response(404, {}, { error: 'Provider not found' });
        }
      });

      this.get('/schedules', (schema) => {
        return schema.schedules.all().models;
      });

      this.post('/schedules', (schema, request) => {
        let attrs: SubmittedSchedule[] = JSON.parse(request.requestBody);
        schema.schedules.all().destroy();
        attrs.forEach((schedule) => schema.schedules.create(schedule));
        return schema.schedules.all().models;
      });

      this.get('/reservations', (schema) => {
        return schema.reservations.all();
      });

      this.post('/reservations', (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        return schema.reservations.create(attrs);
      });

      this.patch('/reservations/:id', (schema, request) => {
        let newAttrs = JSON.parse(request.requestBody);
        let id = request.params.id;
        let reservation = schema.reservations.find(id);
        return reservation.update(newAttrs);
      });

      this.del('/reservations/:id', (schema, request) => {
        let id = request.params.id;
        return schema.reservations.find(id).destroy();
      });

      this.post('/auth/login', (schema, request) => {
        let { name, password } = JSON.parse(request.requestBody);
        const user = schema.users.findBy({ name, password });
        if (user) {
          return new Response(200, {}, { user: { ...user.attrs, token: nanoid() } });
        } else {
          return new Response(401, {}, { error: 'Invalid email or password' });
        }
      });
    },
  });
}
