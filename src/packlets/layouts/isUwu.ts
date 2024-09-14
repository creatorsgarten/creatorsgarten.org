export const isUwu = (searchParams: URLSearchParams) =>
  searchParams.get('uwu') === 'true' || searchParams.get('kawaii') === 'true'
