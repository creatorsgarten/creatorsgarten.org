import { useEffect, useState } from 'react'
import { Icon } from 'react-iconify-icon-wrapper'

interface Props {
  eventId: string
  slug: string
  transcriptContainerSelector: string
  transcriptLanguage: string
}

interface PopoverState {
  show: boolean
  x: number
  y: number
  selectedText: string
  cues: string[]
}

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error'
}

async function reportTranscriptInaccuracy(
  eventId: string,
  slug: string,
  language: string,
  cues: string[],
  selectedText: string
) {
  
  // Extract timestamp from cue format "startTime-endTime" (already in milliseconds)
  // Use the start time of the first cue
  const firstCue = cues[0]
  if (!firstCue) {
    throw new Error('No cues provided')
  }
  
  const [startTimeMs] = firstCue.split('-')
  const timestamp = parseFloat(startTimeMs) // Keep in milliseconds
  
  const response = await fetch(
    `https://creatorsgarten-video-captions-review.spacet.me/flags/${eventId}/${slug}/${language}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp,
        text: selectedText,
      }),
    }
  )
  
  if (!response.ok) {
    throw new Error(`Failed to submit flag: ${response.status} ${response.statusText}`)
  }
  
  const result = await response.json()
  return result
}

export default function TranscriptInaccuracyReporter({
  eventId,
  slug,
  transcriptContainerSelector,
  transcriptLanguage,
}: Props) {
  const [popover, setPopover] = useState<PopoverState>({
    show: false,
    x: 0,
    y: 0,
    selectedText: '',
    cues: [],
  })

  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success',
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    function handleSelectionChange() {
      const selection = window.getSelection()

      if (!selection || selection.isCollapsed) {
        setPopover(prev => ({ ...prev, show: false }))
        return
      }

      const range = selection.getRangeAt(0)
      const transcriptContainer = document.querySelector(
        transcriptContainerSelector
      )

      if (
        !transcriptContainer ||
        !transcriptContainer.contains(range.commonAncestorContainer)
      ) {
        setPopover(prev => ({ ...prev, show: false }))
        return
      }

      const { cues, filteredText } = extractCuesAndTextFromSelection(range)

      if (cues.length === 0 || !filteredText.trim()) {
        setPopover(prev => ({ ...prev, show: false }))
        return
      }

      const rect = range.getBoundingClientRect()
      
      // Unified positioning: above selection, pointing down
      const popoverHeight = 50 // Approximate height of compact popover
      const arrowHeight = 8
      
      let x = rect.left + rect.width / 2
      let y = rect.top - popoverHeight - arrowHeight
      
      // Keep popover within viewport bounds
      const popoverWidth = 120 // Approximate width of compact popover
      const margin = 8
      
      if (x - popoverWidth / 2 < margin) {
        x = margin + popoverWidth / 2
      } else if (x + popoverWidth / 2 > window.innerWidth - margin) {
        x = window.innerWidth - margin - popoverWidth / 2
      }
      
      if (y < margin) {
        // If not enough space above, position below selection
        y = rect.bottom + arrowHeight
      }


      setPopover({
        show: true,
        x,
        y,
        selectedText: filteredText,
        cues,
      })
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element
      
      // Don't hide if clicking on the popover itself
      if (target.closest('[data-transcript-popover]')) {
        return
      }
      
      // Don't hide if clicking within the transcript container (user might be making another selection)
      const transcriptContainer = document.querySelector(transcriptContainerSelector)
      if (transcriptContainer && transcriptContainer.contains(target)) {
        return
      }
      
      // Hide popover for clicks outside transcript area
      setPopover(prev => ({ ...prev, show: false }))
    }

    function handleMouseUp() {
      // Add a small delay to ensure selection is finalized
      setTimeout(handleSelectionChange, 10)
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [transcriptContainerSelector])

  function extractCuesAndTextFromSelection(range: Range): {
    cues: string[]
    filteredText: string
  } {
    const cues = new Set<string>()
    
    // Get the actual selected text first
    const actualSelectedText = range.toString().trim()

    // Find which cue elements the selection intersects with
    const transcriptContainer = document.querySelector(transcriptContainerSelector)
    if (!transcriptContainer) return { cues: [], filteredText: '' }
    
    const cueElements = transcriptContainer.querySelectorAll('[data-cue]')

    for (const element of cueElements) {
      if (range.intersectsNode(element)) {
        const cue = element.getAttribute('data-cue')
        if (cue) {
          cues.add(cue)
        }
      }
    }
    
    // Simple approach: if we found cues, filter the text by checking if the 
    // selection is primarily within cue elements
    if (cues.size > 0) {
      // Check if the selection start and end are both within cue elements
      const startContainer = range.startContainer
      const endContainer = range.endContainer
      
      const isStartInCue = startContainer.nodeType === Node.TEXT_NODE && 
        startContainer.parentElement?.closest('[data-cue]')
      const isEndInCue = endContainer.nodeType === Node.TEXT_NODE && 
        endContainer.parentElement?.closest('[data-cue]')
      
      
      // If both start and end are in cue elements, use the actual selected text
      if (isStartInCue && isEndInCue) {
        return {
          cues: Array.from(cues),
          filteredText: actualSelectedText,
        }
      }
      
      // Otherwise, extract only the text from cue elements in the selection
      const clonedContents = range.cloneContents()
      const cueSpansInSelection = clonedContents.querySelectorAll('[data-cue]')
      const textParts: string[] = []
      
      for (const span of cueSpansInSelection) {
        const text = span.textContent?.trim()
        if (text) {
          textParts.push(text)
        }
      }
      
      return {
        cues: Array.from(cues),
        filteredText: textParts.join(' ').trim(),
      }
    }

    return {
      cues: [],
      filteredText: '',
    }
  }

  async function handleReportClick() {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      await reportTranscriptInaccuracy(
        eventId,
        slug,
        transcriptLanguage,
        popover.cues,
        popover.selectedText
      )
      setPopover(prev => ({ ...prev, show: false }))
      setToast({
        show: true,
        message: 'Transcript inaccuracy reported successfully!',
        type: 'success',
      })
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000)
    } catch (error) {
      console.error('Failed to report transcript inaccuracy:', error)
      setToast({
        show: true,
        message: 'Failed to report transcript inaccuracy. Please try again.',
        type: 'error',
      })
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCopyClick() {
    try {
      await navigator.clipboard.writeText(popover.selectedText)
      // TODO: Add visual feedback for successful copy
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }


  return (
    <>
      {/* Compact black tooltip with downward arrow */}
      {popover.show && (
        <div
          data-transcript-popover
          className="fixed z-[9999] rounded-md bg-black text-white shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 before:absolute before:left-1/2 before:top-full before:h-0 before:w-0 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-black"
          style={{
            left: `${popover.x}px`,
            top: `${popover.y}px`,
            transform: 'translateX(-50%)',
            pointerEvents: 'auto',
          }}
        >
          <div className="flex gap-2 px-3 py-2">
            <button
              onClick={handleCopyClick}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors hover:bg-gray-700"
              title="Copy selected text"
            >
              <Icon icon="pixelarticons:copy" className="h-3 w-3" />
              Copy
            </button>
            <button
              onClick={handleReportClick}
              disabled={isLoading}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Report transcript inaccuracy"
            >
              {isLoading ? (
                <Icon icon="svg-spinners:180-ring" className="h-3 w-3" />
              ) : (
                <Icon icon="heroicons:exclamation-triangle" className="h-3 w-3" />
              )}
              Report
            </button>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-[10000] rounded-md px-4 py-3 text-white shadow-lg animate-in slide-in-from-right-5 duration-300 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              icon={toast.type === 'success' ? 'heroicons:check-circle' : 'heroicons:x-circle'}
              className="h-4 w-4"
            />
            <span className="text-sm">{toast.message}</span>
          </div>
        </div>
      )}
    </>
  )
}
