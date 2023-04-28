export const eventpopClient = {
  id: import.meta.env.EVENTPOP_CLIENT_ID ?? process.env.EVENTPOP_CLIENT_ID,
  secret:
    import.meta.env.EVENTPOP_CLIENT_SECRET ??
    process.env.EVENTPOP_CLIENT_SECRET,
}
