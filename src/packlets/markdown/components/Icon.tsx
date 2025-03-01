import { Icon as Iconify } from 'react-iconify-icon-wrapper'

export interface IconProps {
  attributes: {
    icon: string
  }
}

/**
 * Renders an inline icon from the Iconify library
 */
export function Icon(props: IconProps) {
  return <Iconify inline icon={props.attributes.icon} />
}