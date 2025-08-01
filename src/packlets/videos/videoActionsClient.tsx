import { useState } from 'react'
import { Icon } from 'react-iconify-icon-wrapper'
import ContributeDialog from './contributeDialog'

interface Props {
  eventId: string
  slug: string
  transcriptUrl?: string
}

export default function VideoActionsClient({ eventId, slug, transcriptUrl }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setDialogOpen(true)}
          className="videoActionsButton"
        >
          <Icon icon="heroicons:question-mark-circle" />
          How to Contribute
        </button>
        <a
          href={`https://github.com/creatorsgarten/videos/blob/main/data/videos/${eventId}/${slug}.md`}
          className="videoActionsButton"
        >
          <Icon icon="pixelarticons:edit" />
          Edit metadata on GitHub
        </a>
      </div>

      <ContributeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        transcriptUrl={transcriptUrl}
      />

      <style>{`
        .videoActionsButton {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          border-radius: 0.375rem;
          border: 1px solid #d4d4d8;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #171717;
          text-decoration: none;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .videoActionsButton:hover {
          background: #f4f4f5;
          border-color: #a1a1aa;
        }
      `}</style>
    </>
  )
}