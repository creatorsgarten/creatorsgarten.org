import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { DISCORD_NOTIFY_WEBHOOK_URL } from 'astro:env/server'

import type { User } from '$types/mongo/User'

dayjs.extend(utc)
dayjs.extend(timezone)

export const notify = async (user: User, door: string, time: Date) => {
  await Promise.all([
    fetch(DISCORD_NOTIFY_WEBHOOK_URL, {
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
