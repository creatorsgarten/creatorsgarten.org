/**
 * Parses YouTube-style timestamp parameter into seconds
 * Supports formats: 123s, 1m23s, 1h2m3s, or plain numbers (treated as seconds)
 */
export function parseTimestamp(timestampParam: string | null): number | null {
  if (!timestampParam) return null

  // Remove any whitespace
  const input = timestampParam.trim()
  if (!input) return null

  // If it's just a number, treat as seconds
  const numericMatch = input.match(/^\d+$/)
  if (numericMatch) {
    return parseInt(input, 10)
  }

  // Parse h/m/s format
  let totalSeconds = 0
  let remainingInput = input

  // Extract hours (1h)
  const hoursMatch = remainingInput.match(/(\d+)h/)
  if (hoursMatch) {
    totalSeconds += parseInt(hoursMatch[1], 10) * 3600
    remainingInput = remainingInput.replace(hoursMatch[0], '')
  }

  // Extract minutes (2m)
  const minutesMatch = remainingInput.match(/(\d+)m/)
  if (minutesMatch) {
    totalSeconds += parseInt(minutesMatch[1], 10) * 60
    remainingInput = remainingInput.replace(minutesMatch[0], '')
  }

  // Extract seconds (30s)
  const secondsMatch = remainingInput.match(/(\d+)s/)
  if (secondsMatch) {
    totalSeconds += parseInt(secondsMatch[1], 10)
    remainingInput = remainingInput.replace(secondsMatch[0], '')
  }

  // If there's any unmatched content, the format is invalid
  if (remainingInput.trim()) {
    return null
  }

  // Must have at least one time component
  if (totalSeconds === 0 && !hoursMatch && !minutesMatch && !secondsMatch) {
    return null
  }

  return totalSeconds
}