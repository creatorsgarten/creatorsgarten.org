import fs from 'fs';
import axios from 'axios';

interface WikiStorage {
  mode: 'local' | 'remote' | 'preview';
  read(slug: string): Promise<string>;
}

class LocalWikiStorage implements WikiStorage {
  mode = 'local' as const;
  async read(slug: string) {
    return fs.readFileSync(`wiki/${slug}.md`, 'utf8');
  }
}
class RemoteWikiStorage implements WikiStorage {
  mode = 'remote' as const;
  constructor(public urlBase: string) {}
  async read(slug: string) {
    const response = await axios.get(this.urlBase + slug + '.md');
    console.log(response.config.url);
    return Buffer.from(response.data.content, 'base64').toString();
  }
}

let storage: WikiStorage | undefined;

function getStorage(): WikiStorage {
  if (!storage) {
    const url = process.env.WIKI_STORAGE_URL;
    storage = url ? new RemoteWikiStorage(url) : new LocalWikiStorage();
  }
  return storage;
}

export async function getPage(slug: string): Promise<PageData> {
  return {
    content: await getStorage().read(slug),
    mode: 'local'
  };
}

export interface PageData {
  content: string;
  mode: 'local' | 'remote' | 'preview';
  sha?: string;
}
