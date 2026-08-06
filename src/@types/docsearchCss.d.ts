// @docsearch/css is a CSS-only package (no exports, no type declarations --
// see its package.json, "main": "dist/style.css") imported purely for its
// side effect. TS6+ requires an explicit ambient module for this pattern
// (TS2882) where older TypeScript silently allowed it.
declare module '@docsearch/css'
