import MarkdownIt from 'markdown-it';
import mim from 'markdown-it-meta';
import mihs from 'markdown-it-header-sections';
import mila from 'markdown-it-link-attributes';

const headerParser = (match: string, title: string) => {
  return `<div class="relative flex py-2 items-center">
      <div class="flex-grow border-t border-gray-600"></div>
      <span class="flex-shrink text-xl mx-4 text-gray-600">${title}</span>
      <div class="flex-grow border-t border-gray-600"></div>
  </div>`;
};

export function processMarkdown(input: MarkdownProcessInput): MarkdownProcessOutput {
  const md = new MarkdownIt({ html: true }).use(mim).use(mihs).use(mila);
  const body = input.content;
  const html = md.render(body).replace(/<h1>(.*)<\/h1>/g, headerParser);
  const meta = md.meta;
  return { html, meta };
}

export interface MarkdownProcessInput {
  content: string;
}

export interface MarkdownProcessOutput {
  html: string;
  meta: any;
}
