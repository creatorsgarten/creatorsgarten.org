interface EventpopMeResponse {
  user: {
    id: number
    full_name: string
    email: string
    avatar: string
    avatars: {
      original: string
      medium: string
      thumb: string
      tiny: string
    }
    birthday: string
    gender: string
    phone: string
  }
}

export const getEventpopUser = async (accessToken: string) => {
  const { user } = await fetch(
    `https://eventpop.me/api/public/me?${new URLSearchParams({
      access_token: accessToken,
    }).toString()}`
  ).then(o => {
    if (o.ok) return o.json() as Promise<EventpopMeResponse>
    else throw o
  })

  return user
}
