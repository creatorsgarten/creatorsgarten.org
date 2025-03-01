export interface GoogleMapProps {
  attributes: {
    src: string
  }
}

/**
 * Renders a Google Maps embed from a Google Maps URL
 */
export function GoogleMap(props: GoogleMapProps) {
  const src = String(props.attributes.src)
  
  // Match Google Maps embed URL format
  const match = src.match(/https:\/\/www\.google\.com\/maps\/embed\?pb=([^&]+)/)
  if (!match) {
    return <div>Invalid Google Maps URL</div>
  }
  
  const pb = match[1]
  return (
    <iframe
      src={'https://www.google.com/maps/embed?pb=' + pb}
      className="h-[450px] w-full rounded-sm shadow-sm"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  )
}