export interface EventTicket {
  /** Eventpop event ID */
  id: number

  /** Eventpop ticket ID */
  ticketId: number

  /** Reference code */
  code: string

  /** First name associated with the ticket */
  firstName: string

  /** Last name associated with the ticket */
  lastName: string

  /** Email address associated with the ticket */
  email: string

  /** The ticket type */
  ticketType: {
    /** Ticket type ID */
    id: number
    /** Ticket type name */
    name: string
  }
}
