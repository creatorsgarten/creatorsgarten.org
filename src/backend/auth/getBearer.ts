export const getBearer = (input?: string) =>
  input?.startsWith('Bearer ') ? input.slice(7) : undefined
