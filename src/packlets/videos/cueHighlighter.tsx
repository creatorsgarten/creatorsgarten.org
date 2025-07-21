import { useEffect } from 'react'
import TranscriptInaccuracyReporter from './transcriptInaccuracyReporter'

let triggered: Promise<typeof YT> | null = null
async function loadYouTubeApi(): Promise<typeof YT> {
  if (triggered) return triggered

  const myWindow = window as unknown as { YT?: typeof YT }
  if (myWindow.YT) return myWindow.YT!

  const tag = document.createElement('script')
  tag.src = 'https://www.youtube.com/iframe_api'
  tag.async = true
  return (triggered = new Promise<typeof YT>((resolve, reject) => {
    Object.assign(myWindow, {
      onYouTubeIframeAPIReady: () => resolve(myWindow.YT!),
    })
    tag.onerror = reject
    document.head.appendChild(tag)
  }))
}

export default function CueHighlighter(props: { 
  iframeId: string
  eventId: string
  slug: string
  transcriptLanguage: string
}) {
  const { iframeId, eventId, slug, transcriptLanguage } = props
  useEffect(() => {
    let canceled = false
    let onCancel = () => {}
    let player: YT.Player | null = null
    
    loadYouTubeApi().then(YT => {
      if (canceled) return
      player = new YT.Player(iframeId)
      player.addEventListener('onReady', () => {
        for (const context of document.querySelectorAll(
          `[data-cue-by="${iframeId}"]`
        )) {
          const element = context as HTMLElement
          element.dataset.interactive = 'true'
        }
        const cues = Array.from(
          document.querySelectorAll(`[data-cue-by="${iframeId}"] [data-cue]`),
          element => {
            const [start, end] = element.getAttribute('data-cue')!.split('-')
            element.addEventListener('click', () => {
              const selection = window.getSelection()
              if (selection && !selection.isCollapsed) {
                return
              }
              const [start] = element.getAttribute('data-cue')!.split('-')
              player.seekTo(parseFloat(start) / 1000, true)
            })
            return {
              start: parseFloat(start),
              end: end ? parseFloat(end) : Infinity,
              element: element as HTMLElement,
            }
          }
        )
        let active = new Set<(typeof cues)[number]>()
        const interval = setInterval(() => {
          const time =
            player.getCurrentTime() * 1000 +
            (player.getCurrentTime() < 0.1 ? -1 : 50)
          const matching = new Set(
            cues.filter(cue => cue.start <= time && time < cue.end)
          )
          for (const cue of active) {
            if (!matching.has(cue)) {
              delete cue.element.dataset.active
            }
          }
          for (const cue of matching) {
            if (!active.has(cue)) {
              cue.element.dataset.active = 'true'
            }
          }
          active = matching
        }, 100)
        
        // Add keyboard shortcuts for video control
        const handleKeyDown = (event: KeyboardEvent) => {
          // Don't interfere with typing in input fields
          if (event.target instanceof HTMLInputElement || 
              event.target instanceof HTMLTextAreaElement ||
              (event.target as HTMLElement)?.contentEditable === 'true') {
            return
          }
          
          switch (event.code) {
            case 'Space':
              event.preventDefault()
              const playerState = player.getPlayerState()
              if (playerState === YT.PlayerState.PLAYING) {
                player.pauseVideo()
              } else if (playerState === YT.PlayerState.PAUSED) {
                player.playVideo()
              }
              break
              
            case 'ArrowLeft':
              event.preventDefault()
              const currentTime = player.getCurrentTime()
              player.seekTo(Math.max(0, currentTime - 5), true)
              break
              
            case 'ArrowRight':
              event.preventDefault()
              const currentTimeRight = player.getCurrentTime()
              player.seekTo(currentTimeRight + 5, true)
              break
          }
        }
        
        document.addEventListener('keydown', handleKeyDown)
        
        onCancel = () => {
          clearInterval(interval as unknown as NodeJS.Timeout)
          document.removeEventListener('keydown', handleKeyDown)
        }
      })
    })
    return () => {
      canceled = true
      onCancel()
    }
  }, [iframeId])
  return (
    <TranscriptInaccuracyReporter
      eventId={eventId}
      slug={slug}
      transcriptContainerSelector={`[data-cue-by="${iframeId}"]`}
      transcriptLanguage={transcriptLanguage}
    />
  )
}
