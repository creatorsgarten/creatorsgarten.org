import { Icon as Iconify } from 'react-iconify-icon-wrapper'
import type { MarkdownCustomComponents } from '@contentsgarten/html'
import type { ReactNode } from 'react'

export const customComponents: MarkdownCustomComponents = {
  leafDirective: {
    RatingTally,
    GoogleMap,
  },
  textDirective: {
    Icon,
  },
  containerDirective: {
    Draft,
  },
}

interface RatingTally {
  attributes: {
    tally: string
    min: string
    max: string
  }
}
function RatingTally(props: RatingTally) {
  const minKey = Number(props.attributes.min || 1)
  const maxKey = Number(props.attributes.max || 10)
  const bucketCount = maxKey - minKey + 1
  const map: Record<number, number> = {}
  for (const item of (props.attributes.tally || '').split(',')) {
    const [rating, count] = item.split('=')
    map[Number(rating)] = Number(count)
  }
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
                <div className="bg-sky-600" style={{ height }} />
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

interface Icon {
  attributes: {
    icon: string
  }
}
function Icon(props: Icon) {
  return <Iconify inline icon={props.attributes.icon} />
}

interface GoogleMap {
  attributes: {
    src: string
  }
}
function GoogleMap(props: GoogleMap) {
  const src = String(props.attributes.src)
  // Match pattern like https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15501.45973148637!2d100.5657039!3d13.7568529!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29e62ffffffff%3A0x109e22bdc9d374e6!2sPay%20Solution%20Co.%2C%20Ltd.!5e0!3m2!1sen!2sth!4v1681588598414!5m2!1sen!2sth
  const match = src.match(/https:\/\/www\.google\.com\/maps\/embed\?pb=([^&]+)/)
  if (!match) {
    return <div>Invalid Google Maps URL</div>
  }
  const pb = match[1]
  return (
    <iframe
      src={'https://www.google.com/maps/embed?pb=' + pb}
      className="h-[450px] w-full rounded shadow"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  )
}

interface Draft {
  children?: ReactNode
}
function Draft(props: Draft) {
  return (
    <div className="font-casual relative my-3 rounded border border-dashed border-slate-400 px-2 pt-5 text-slate-700">
      <div className="absolute left-0 top-0 rounded-br border-b border-r border-dashed border-slate-400 px-2 py-1 text-xs">
        draft
      </div>
      {props.children}
    </div>
  )
}
