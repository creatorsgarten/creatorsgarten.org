import { formatTimecode } from '$functions/formatTimecode'
import { Comparator } from '@dtinth/comparator'
import clsx from 'clsx'
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
    <div className="prose prose-sm max-w-full" data-transcript>
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
          <p
            className={clsx(inChapter ? 'pl-6' : '', 'text-sm leading-relaxed')}
          >
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
  let currentGroup: Group | undefined = undefined
  let nextChapterIndex = 0

  const defaultGaps = [1000, 1000, 1000, 1000, 1000]
  let gaps = [...defaultGaps]

  // Track characters per second
  let speeds = [10, 10, 10, 10]
  let lastTime: number | undefined

  for (const cue of cues) {
    let currentGap = 0
    if (lastTime !== undefined) {
      gaps.push(cue.start - lastTime)
      currentGap = cue.start - lastTime
      if (gaps.length > 10) gaps.shift()
    }

    const sortedSpeeds = speeds.toSorted(Comparator.naturalOrder())
    const assumedSpeed = sortedSpeeds[Math.floor(sortedSpeeds.length * 0.5)]

    lastTime = Math.min(
      cue.end,
      cue.start + cue.text.length * (1000 / assumedSpeed)
    )

    const sortedGaps = gaps.toSorted(Comparator.naturalOrder())
    const maxThreshold = Math.min(
      sortedGaps[Math.floor(sortedGaps.length * 0.8)] + 200,
      2000
    )

    speeds.push(cue.text.length / ((cue.end - cue.start) / 1000))
    if (speeds.length > 10) speeds.shift()

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
    if (currentGap <= maxThreshold) {
      currentGroup.cues.push(cue)
    } else {
      currentGroup = { type: 'text', cues: [cue] }
      output.push(currentGroup)
    }
  }
  return output
}
