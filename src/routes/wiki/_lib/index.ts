import fs from 'fs';

export async function getPage(slug: string): Promise<PageData> {
  return {
    content: fs.readFileSync(`wiki/${slug}.md`, 'utf8'),
    mode: 'local'
  };
}

export interface PageData {
  content: string;
  mode: 'local' | 'remote' | 'preview';
  sha?: string;
}
