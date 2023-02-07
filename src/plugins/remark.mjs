import externalLinks from 'remark-external-links'
import sectionize from 'remark-sectionize'
import { headerPlugin } from './headerPlugin.mjs'

export const remarkPlugins = [
  externalLinks,
  sectionize,
  headerPlugin
]
