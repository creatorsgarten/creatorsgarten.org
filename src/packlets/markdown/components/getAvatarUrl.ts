/**
 * Get the avatar URL for a given user/source
 */
export function getAvatarUrl(from: string): string {
  // Handle GitHub usernames
  if (from.startsWith('@')) {
    return `https://github.com/${encodeURIComponent(from.slice(1))}.png`
  }
  
  // Handle known AI chatbots
  if (from === 'ChatGPT') return '/images/chatbots/chatgpt.png'
  if (from === 'GPT-4o') return '/images/chatbots/chatgpt.png'
  if (from === 'Claude') return '/images/chatbots/claude.png'
  if (from === 'Gemini') return '/images/chatbots/gemini.png'

  // For other names, use a placeholder avatar service
  return (
    `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=` +
    encodeURIComponent(from)
  )
}