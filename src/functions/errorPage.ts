export function errorPage(status: number, statusText: string, message: string) {
  return new Response(message, {
    status: status,
    statusText: statusText,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
