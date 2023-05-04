import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import type { Event } from './getEvents'

dayjs.extend(utc)
dayjs.extend(timezone)

export const upcomingEventsFilter = (event: Event) => {
  const targetToCompare = event.endDate ?? event.date

  return targetToCompare.tz('Asia/Bangkok').endOf('day').isAfter(new Date())
}
