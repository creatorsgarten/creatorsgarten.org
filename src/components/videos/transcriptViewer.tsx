import { formatTimecode } from '$functions/formatTimecode'
import { Fragment } from 'react'
import type * as subtitle from 'subtitle'

export interface TranscriptViewer {
  cues: subtitle.Cue[]
  chapters?: Chapter[]
}

export default function TranscriptViewer(props: TranscriptViewer) {
  const groups = groupCues(props.cues, props.chapters)
  let inChapter = false
  return (
    <div className="prose max-w-full">
      {groups.map(group => {
        if (group.type === 'chapter') {
          inChapter = true
          return (
            <h2 className="flex text-lg">
              <span className="flex-auto">{group.chapter.title}</span>
              <span className="text-neutral-500">
                {formatTimecode(group.chapter.time)}
              </span>
            </h2>
          )
        }
        return (
          <p className={inChapter ? 'pl-6' : ''}>
            {group.cues.map((cue, i) => (
              <Fragment key={i}>
                <span key={i} data-cue={`${cue.start}-${cue.end}`}>
                  {cue.text}
                </span>{' '}
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}

export type Group =
  | { type: 'text'; cues: subtitle.Cue[] }
  | { type: 'chapter'; chapter: Chapter }

export interface Chapter {
  time: number
  title: string
}

function groupCues(cues: subtitle.Cue[], chapters: Chapter[] = []): Group[] {
  const output: Group[] = []
  const maxThreshold = 1000
  // Group cues that has less than 500ms gap
  let currentGroup: Group | undefined = undefined
  let nextChapterIndex = 0
  for (const cue of cues) {
    if (
      nextChapterIndex < chapters.length &&
      chapters[nextChapterIndex].time <= cue.start
    ) {
      output.push({ type: 'chapter', chapter: chapters[nextChapterIndex] })
      nextChapterIndex++
      currentGroup = undefined
    }

    if (!currentGroup) {
      currentGroup = { type: 'text', cues: [cue] }
      output.push(currentGroup)
      continue
    }
    const lastCue = currentGroup.cues[currentGroup.cues.length - 1]
    if (cue.start - lastCue.end < maxThreshold) {
      currentGroup.cues.push(cue)
    } else {
      currentGroup = { type: 'text', cues: [cue] }
      output.push(currentGroup)
    }
  }
  return output
}
