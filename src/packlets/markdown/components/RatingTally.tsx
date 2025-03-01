export interface RatingTallyProps {
  attributes: {
    tally: string
    min: string
    max: string
  }
}

/**
 * Renders a bar graph tally of ratings
 */
export function RatingTally(props: RatingTallyProps) {
  const minKey = Number(props.attributes.min || 1)
  const maxKey = Number(props.attributes.max || 10)
  const bucketCount = maxKey - minKey + 1
  
  // Parse tally data
  const map: Record<number, number> = {}
  for (const item of (props.attributes.tally || '').split(',')) {
    const [rating, count] = item.split('=')
    map[Number(rating)] = Number(count)
  }
  
  // Calculate stats
  const max = Math.max(1, ...Object.values(map))
  const sum = Object.entries(map).reduce(
    (acc, [k, v]) => acc + Number(k) * v,
    0
  )
  const count = Object.values(map).reduce((acc, v) => acc + v, 0)
  
  return (
    <div className="not-prose">
      <div className="flex items-end">
        {Array.from({ length: bucketCount }).map((_, i) => {
          const k = minKey + i
          const v = map[k] || 0
          const height = Math.round((v / max) * 100)
          return (
            <div key={k} className="flex flex-1 flex-col text-center">
              <div className="text-slate-600">{v}</div>
              <div className="px-[10%]">
                <div className="bg-blue-500" style={{ height }} />
              </div>
              <div className="border-t border-slate-400">{k}</div>
            </div>
          )
        })}
      </div>
      <div className="text-center text-slate-500">
        {count > 0 ? (
          <>
            (average={Math.round((sum / count) * 10) / 10}, n={count})
          </>
        ) : (
          <>(no ratings)</>
        )}
      </div>
    </div>
  )
}