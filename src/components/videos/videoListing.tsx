import type { FilteredListing } from '$functions/getVideos'

export interface VideoListing {
  filteredListing: FilteredListing
}

export default function VideoListing(props: VideoListing) {
  const {
    index: {
      events,
      speakers,
      videos: { length: totalVideos },
    },
    filter,
    filteredVideos,
    relatedEvent,
  } = props.filteredListing

  const renderLink = (
    href: string,
    active: boolean,
    children: React.ReactNode
  ) => (
    <a
      className={
        'block' +
        (active ? ' -mx-2 -my-1 rounded-md bg-neutral-200 px-2 py-1' : '')
      }
      href={href}
    >
      {children}
    </a>
  )

  const renderInformationBox = (
    children: React.ReactNode,
    cta?: { text: string; href: string }
  ) => (
    <div className="mb-6 flex gap-4 rounded-lg bg-neutral-100 p-4 shadow">
      <div className="flex-1">{children}</div>
      {!!cta && (
        <a className="text-primary-600 flex items-center gap-1" href={cta.href}>
          {cta.text}
        </a>
      )}
    </div>
  )

  return (
    <div className="my-8 grid grid-cols-[100%] gap-8 md:grid-cols-[240px_1fr]">
      <div className="md:col-start-2 md:row-start-1">
        {!filter && (
          <div className="md:hidden">
            {renderInformationBox(<>Showing all {totalVideos} videos</>, {
              text: 'Filter',
              href: '#video-filter',
            })}
          </div>
        )}
        {filter?.type === 'event' &&
          !!relatedEvent &&
          renderInformationBox(
            <>
              Showing videos for event{' '}
              <a className="font-medium" href={`/event/${relatedEvent.id}`}>
                {relatedEvent.name}
              </a>
            </>,
            { text: 'Go to event', href: `/event/${relatedEvent.id}` }
          )}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-6 md:col-start-1 md:row-start-1">
          {filteredVideos.map(video => (
            <a
              href={`/videos/${video.eventId}/${video.slug}`}
              key={`${video.eventId}/${video.slug}`}
              className="flex flex-col"
            >
              <div className="flex flex-auto flex-col overflow-hidden rounded-lg shadow">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  width="400"
                  height="225"
                  className="aspect-video w-full flex-none object-cover"
                />
                <div className="flex-auto p-4">
                  <h3 className="line-clamp-2 text-lg font-semibold">
                    {video.title}
                  </h3>
                  <div className="text-muted line-clamp-1">
                    {video.speakers.join(', ')}
                  </div>
                  <div className="text-muted line-clamp-1">
                    {video.eventTitle}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 px-2 py-1" id="video-filter">
        {renderLink(
          '/videos',
          filter === undefined,
          <h3 className="flex text-base font-medium">
            <span className="block flex-1 truncate">All videos</span>
            <span className="pl-1 text-neutral-600">{totalVideos}</span>
          </h3>
        )}
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-medium">By event</h3>
          <ul className="flex flex-col gap-1 text-sm text-neutral-800">
            {events.map(event => (
              <li key={event.entity.id}>
                {renderLink(
                  `/videos/${encodeURIComponent(event.entity.id)}`,
                  filter?.type === 'event' &&
                    filter.eventId === event.entity.id,
                  <span className="flex">
                    <span className="block flex-1 truncate">
                      {event.entity.name}
                    </span>
                    <span className="pl-1 text-neutral-600">{event.count}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-medium">By speaker</h3>
          <ul className="flex flex-col gap-1 text-sm text-neutral-800">
            {speakers.map(event => (
              <li key={event.entity}>
                {renderLink(
                  `/videos?speaker=${encodeURIComponent(event.entity)}`,
                  filter?.type === 'speaker' && filter.speaker === event.entity,
                  <span className="flex">
                    <span className="block flex-1 truncate">
                      {event.entity}
                    </span>
                    <span className="pl-1 text-neutral-600">{event.count}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
