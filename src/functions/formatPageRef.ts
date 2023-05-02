const isUpper = (s: string) => s.toLowerCase() !== s

export function formatPageRef(pageRef: string) {
  return Array.from(pageRef)
    .map((char, index, s) => {
      const previous = s[index - 1]
      const shouldInsertSpace = (() => {
        if (!previous) return false
        if ((previous === '/') !== (char === '/')) return true
        if (isUpper(char) && !isUpper(previous)) return true
        return false
      })()
      return shouldInsertSpace ? ` ${char}` : char
    })
    .join('')
}
