interface EventpopTicket {
  id: number
  event_id: number
  status: string
  firstname: string
  lastname: string
  phone: string
  email: string
  reference_code: string
  ticket_type: {
    id: number
    name: string
    /** @example '฿0.00' */
    price: string
    price_satangs: number
    kind: 'free' | 'paid'
  }
}

interface EventpopTicketsResponse {
  success: boolean
  tickets: EventpopTicket[]
  count: number
  total: number
  page: number
  per_page: number
}

export const getEventpopUserTickets = async (accessToken: string) => {
  let page = 1
  const tickets: EventpopTicket[] = []

  while (true) {
    console.log('page ' + page)
    const response = await fetch(
      `https://www.eventpop.me/api/public/organizers/1017/tickets?${new URLSearchParams(
        {
          page: page.toString(),
          access_token: accessToken,
        }
      ).toString()}`
    ).then(o => {
      if (o.ok) return o.json() as Promise<EventpopTicketsResponse>
      else throw o
    })

    tickets.push(...response.tickets)

    if (response.per_page !== response.count) break
    else page++
  }

  return tickets
}
