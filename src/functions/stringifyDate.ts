import type { Dayjs } from 'dayjs'

export const stringifyDate = (input: Dayjs) => input.format('D MMMM YYYY')
