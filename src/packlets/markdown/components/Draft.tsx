import type { ReactNode } from 'react'

export interface DraftProps {
  children?: ReactNode
}

/**
 * Wraps content in a draft box to indicate unfinished content
 */
export function Draft(props: DraftProps) {
  return (
    <div className="relative my-3 rounded-sm border border-dashed border-slate-400 px-2 pt-5 font-casual text-slate-700">
      <div className="absolute left-0 top-0 rounded-br border-b border-r border-dashed border-slate-400 px-2 py-1 text-xs">
        draft
      </div>
      {props.children}
    </div>
  )
}