export function formatTimecode(millis: number, long = false) {
  const seconds = Math.floor(millis / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const pad = (n: number) => n.toString().padStart(2, '0')
  if (!long && hours === 0) {
    return `${minutes}:${pad(seconds % 60)}`
  }
  return `${hours}:${pad(minutes % 60)}:${pad(seconds % 60)}`
}
