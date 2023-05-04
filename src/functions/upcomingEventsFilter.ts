import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

import type { Event } from './getEvents'
export const upcomingEventsFilter = (event: Event) => {
  const targetToCompare = event.endDate ?? event.date

  return dayjs(targetToCompare)
    .tz('Asia/Bangkok')
    .endOf('day')
    .isAfter(new Date())
}
