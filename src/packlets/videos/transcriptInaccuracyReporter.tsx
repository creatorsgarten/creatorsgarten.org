import { useEffect, useState } from 'react'
import { Icon } from 'react-iconify-icon-wrapper'

interface Props {
  eventId: string
  slug: string
  transcriptContainerSelector: string
}

interface PopoverState {
  show: boolean
  x: number
  y: number
  selectedText: string
  cues: string[]
}

async function reportTranscriptInaccuracy(
  eventId: string,
  slug: string,
  cues: string[],
  selectedText: string
) {
  console.log('Reporting inaccuracy:', { eventId, slug, cues, selectedText })
  alert(
    `Under construction\nEvent: ${eventId}\nSlug: ${slug}\nCues: ${cues.join(', ')}\nText: ${selectedText}`
  )
  return { success: true }
}

export default function TranscriptInaccuracyReporter({
  eventId,
  slug,
  transcriptContainerSelector,
}: Props) {
  const [popover, setPopover] = useState<PopoverState>({
    show: false,
    x: 0,
    y: 0,
    selectedText: '',
    cues: [],
  })

  useEffect(() => {
    function handleSelectionChange() {
      console.log('Selection changed')
      const selection = window.getSelection()
      console.log('Selection:', selection)

      if (!selection || selection.isCollapsed) {
        console.log('No selection or collapsed')
        setPopover(prev => ({ ...prev, show: false }))
        return
      }

      const range = selection.getRangeAt(0)
      const transcriptContainer = document.querySelector(
        transcriptContainerSelector
      )
      console.log('Transcript container:', transcriptContainer)
      console.log('Range ancestor:', range.commonAncestorContainer)

      if (
        !transcriptContainer ||
        !transcriptContainer.contains(range.commonAncestorContainer)
      ) {
        console.log('Selection not in transcript container')
        setPopover(prev => ({ ...prev, show: false }))
        return
      }

      const { cues, filteredText } = extractCuesAndTextFromSelection(range)
      console.log('Extracted cues:', cues)
      console.log('Filtered text:', filteredText)

      if (cues.length === 0 || !filteredText.trim()) {
        console.log('No cues found or no text in cues')
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

      console.log('Showing popover at:', { x, y, rect })

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
    console.log('Actual selected text:', actualSelectedText)

    // Find which cue elements the selection intersects with
    const transcriptContainer = document.querySelector(transcriptContainerSelector)
    if (!transcriptContainer) return { cues: [], filteredText: '' }
    
    const cueElements = transcriptContainer.querySelectorAll('[data-cue]')

    for (const element of cueElements) {
      if (range.intersectsNode(element)) {
        const cue = element.getAttribute('data-cue')
        if (cue) {
          console.log('Selection intersects cue:', cue)
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
      
      console.log('Start in cue:', isStartInCue, 'End in cue:', isEndInCue)
      
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
    try {
      await reportTranscriptInaccuracy(
        eventId,
        slug,
        popover.cues,
        popover.selectedText
      )
      setPopover(prev => ({ ...prev, show: false }))
    } catch (error) {
      console.error('Failed to report transcript inaccuracy:', error)
    }
  }

  async function handleCopyClick() {
    try {
      await navigator.clipboard.writeText(popover.selectedText)
      console.log('Text copied to clipboard')
      // TODO: Add visual feedback for successful copy
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  if (!popover.show) {
    console.log('Popover not showing, state:', popover)
    return null
  }

  console.log('Rendering popover with state:', popover)

  // Compact black tooltip with downward arrow
  return (
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
          className="flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors hover:bg-gray-700"
          title="Report transcript inaccuracy"
        >
          <Icon icon="heroicons:exclamation-triangle" className="h-3 w-3" />
          Report
        </button>
      </div>
    </div>
  )
}
