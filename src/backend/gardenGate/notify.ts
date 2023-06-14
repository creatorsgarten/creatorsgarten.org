import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { notifyDiscord } from '$constants/secrets/notifyDiscord'

import type { AuthenticatedUser } from '$types/AuthenticatedUser'
import type { WithId } from 'mongodb'

dayjs.extend(utc)
dayjs.extend(timezone)

export const notify = async (
  user: WithId<AuthenticatedUser>,
  door: string,
  time: Date
) => {
  await Promise.all([
    fetch(notifyDiscord, {
      method: 'POST',
      headers: {
        Accepts: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: null,
        embeds: [
          {
            title: user.name,
            description: `Door: **${door}**\nUsed at: **${dayjs(time)
              .tz('Asia/Bangkok')
              .format('DD MMM YYYY HH:mm:ss')} ICT**`,
            color: 2274862,
            thumbnail: {
              url: user.avatar.startsWith('/')
                ? 'https://www.eventpop.me/images/placeholder_user.png'
                : user.avatar,
            },
          },
        ],
        attachments: [],
      }),
    }).then(o => {
      if (!o.ok) throw new Error('cannot-notify-discord')
    }),
  ])
}
