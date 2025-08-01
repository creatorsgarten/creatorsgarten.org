import { useEffect, useRef } from 'react'
import { Icon } from 'react-iconify-icon-wrapper'

interface Props {
  open: boolean
  onClose: () => void
  transcriptUrl?: string
}

export default function ContributeDialog({ open, onClose, transcriptUrl }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => onClose()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    dialog.addEventListener('close', handleClose)
    dialog.addEventListener('keydown', handleKeyDown)

    return () => {
      dialog.removeEventListener('close', handleClose)
      dialog.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="rounded-lg border-0 p-0 shadow-xl backdrop:bg-black/50"
      style={{
        margin: 'auto',
        maxHeight: '90vh',
        overflow: 'auto'
      }}
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            How to Contribute to Transcripts
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close dialog"
          >
            <Icon icon="heroicons:x-mark" className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Reporting Instructions */}
          <section>
            <h3 className="text-lg font-medium mb-3 text-gray-800">
              Report Inaccuracies
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Select text and click Report</p>
                  <p>Highlight the inaccurate text in the transcript, then click the Report button that appears.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Right-click any transcript text</p>
                  <p>Right-click on any transcript segment to select it and show the Report button.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section>
            <h3 className="text-lg font-medium mb-3 text-gray-800">
              Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                <span>Cycle playback speed</span>
                <kbd className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-mono">S</kbd>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                <span>Navigate to timestamp</span>
                <kbd className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-mono">Paste</kbd>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                <span>Play/pause video</span>
                <kbd className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-mono">Space</kbd>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                <span>Seek ±5 seconds</span>
                <kbd className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-mono">← →</kbd>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
              <Icon icon="heroicons:information-circle" className="h-4 w-4 flex-shrink-0" />
              <span>Paste timestamps like "00:02:20.680" to jump to that position</span>
            </div>
          </section>

          {/* GitHub Alternative */}
          {transcriptUrl && (
            <section>
              <h3 className="text-lg font-medium mb-3 text-gray-800">
                Advanced Editing
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                For bulk edits or complex changes, you can edit the transcript directly on GitHub:
              </p>
              <a
                href={transcriptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <Icon icon="pixelarticons:edit" className="h-4 w-4" />
                Edit transcript on GitHub
                <Icon icon="heroicons:arrow-top-right-on-square" className="h-3 w-3" />
              </a>
            </section>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Got it, let's contribute!
          </button>
        </div>
      </div>
    </dialog>
  )
}