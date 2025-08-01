import { useEffect, useRef } from 'react'
import TranscriptInaccuracyReporter, { type TranscriptInaccuracyReporterRef } from './transcriptInaccuracyReporter'

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
  const reporterRef = useRef<TranscriptInaccuracyReporterRef>(null)
  useEffect(() => {
    let canceled = false
    let onCancel = () => {}
    let player: YT.Player | null = null
    let currentSpeedIndex = 0
    const speeds = [1, 1.5, 2]
    
    loadYouTubeApi().then(YT => {
      if (canceled) return
      player = new YT.Player(iframeId)
      player.addEventListener('onReady', () => {
        for (const context of document.querySelectorAll(
          `[data-cue-by="${iframeId}"] [data-transcript]`
        )) {
          const element = context as HTMLElement
          element.dataset.interactive = 'true'
        }
        const cues = Array.from(
          document.querySelectorAll(`[data-cue-by="${iframeId}"] [data-transcript] [data-cue]`),
          element => {
            const [start, end] = element.getAttribute('data-cue')!.split('-')
            element.addEventListener('click', () => {
              const selection = window.getSelection()
              if (selection && !selection.isCollapsed) {
                return
              }
              const [start] = element.getAttribute('data-cue')!.split('-')
              if (player) player.seekTo(parseFloat(start) / 1000, true)
            })
            
            // Add right-click context menu
            element.addEventListener('contextmenu', (event) => {
              event.preventDefault()
              const mouseEvent = event as MouseEvent
              const x = mouseEvent.clientX
              const y = mouseEvent.clientY
              
              if (reporterRef.current) {
                reporterRef.current.showPopoverForElement(element as HTMLElement, x, y)
              }
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
          if (!player) return
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
        
        // Parse timestamp from clipboard text
        const parseTimestamp = (text: string): number | null => {
          // Match patterns like "00:02:20.680", "2:20.680", "1:30:45.123"
          const timestampRegex = /(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\.(\d{3})/
          const match = text.trim().match(timestampRegex)
          
          if (!match) return null
          
          const hours = parseInt(match[1] || '0', 10)
          const minutes = parseInt(match[2], 10)
          const seconds = parseInt(match[3], 10)
          const milliseconds = parseInt(match[4], 10)
          
          return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000
        }

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
              if (!player) return
              const playerState = player.getPlayerState()
              if (playerState === YT.PlayerState.PLAYING) {
                player.pauseVideo()
              } else if (playerState === YT.PlayerState.PAUSED) {
                player.playVideo()
              }
              break
              
            case 'ArrowLeft':
              event.preventDefault()
              if (!player) return
              const currentTime = player.getCurrentTime()
              player.seekTo(Math.max(0, currentTime - 5), true)
              break
              
            case 'ArrowRight':
              event.preventDefault()
              if (!player) return
              const currentTimeRight = player.getCurrentTime()
              player.seekTo(currentTimeRight + 5, true)
              break
              
            case 'KeyS':
              event.preventDefault()
              if (!player) return
              currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length
              const newSpeed = speeds[currentSpeedIndex]
              player.setPlaybackRate(newSpeed)
              break

          }
        }
        
        // Add paste handler for timestamp navigation
        const handlePaste = (event: ClipboardEvent) => {
          // Don't interfere with pasting in input fields
          if (event.target instanceof HTMLInputElement || 
              event.target instanceof HTMLTextAreaElement ||
              (event.target as HTMLElement)?.contentEditable === 'true') {
            return
          }
          
          const pastedText = event.clipboardData?.getData('text/plain')
          if (pastedText) {
            const timestamp = parseTimestamp(pastedText)
            if (timestamp !== null && player) {
              event.preventDefault()
              player.seekTo(timestamp, true)
              player.setPlaybackRate(1) // Set to 1x speed
              currentSpeedIndex = 0 // Reset speed index to 1x
              player.playVideo()
              
              // Find and scroll to the cue element that contains this timestamp
              const timestampMs = timestamp * 1000
              const targetCue = cues.find(cue => 
                cue.start <= timestampMs && timestampMs < cue.end
              )
              
              if (targetCue) {
                targetCue.element.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                })
              }
            }
          }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('paste', handlePaste)
        
        onCancel = () => {
          clearInterval(interval as unknown as NodeJS.Timeout)
          window.removeEventListener('keydown', handleKeyDown)
          window.removeEventListener('paste', handlePaste)
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
      ref={reporterRef}
      eventId={eventId}
      slug={slug}
      transcriptContainerSelector={`[data-cue-by="${iframeId}"] [data-transcript]`}
      transcriptLanguage={transcriptLanguage}
    />
  )
}
