import type { MarkdownCustomComponents } from '@contentsgarten/html'

import './customComponents.css'

// Import extracted components
import { RatingTally } from './components/RatingTally'
import { GoogleMap } from './components/GoogleMap'
import { Message } from './components/Message'
import { Icon } from './components/Icon'
import { Draft } from './components/Draft'

/**
 * Custom components for markdown rendering
 */
export const customComponents: MarkdownCustomComponents = {
  leafDirective: {
    RatingTally,
    GoogleMap,
    Message,
  },
  textDirective: {
    Icon,
  },
  containerDirective: {
    Draft,
    Message,
  },
}
