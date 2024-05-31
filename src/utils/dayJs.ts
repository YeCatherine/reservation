import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const guessTZ = dayjs.tz.guess();

export default dayjs;
export { dayjs, Dayjs, guessTZ };
