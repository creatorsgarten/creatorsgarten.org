import fs from 'fs';
import axios from 'axios';
import crypto from 'crypto';
import type { PageData, Redirect } from './types';
import pMemoize from 'p-memoize';
import ExpiryMap from 'expiry-map';

const cache = new ExpiryMap(60000);
const query = pMemoize(<T>(key: string, f: () => Promise<T>) => f(), { cache });

interface WikiStorage {
  mode: 'local' | 'remote' | 'preview' | 'generated';
  readFile(path: string): Promise<WikiFile | null>;
}

interface WikiFile {
  content: string;
  sha: string;
}

class LocalWikiStorage implements WikiStorage {
  mode = 'local' as const;
  async readFile(path: string): Promise<WikiFile | null> {
    try {
      const buffer = fs.readFileSync(`wiki/${path}`, 'utf8');
      return {
        content: buffer,
        sha: crypto.createHash('sha1').update(buffer).digest('hex')
      };
    } catch (error) {
      if ((error as { code: string }).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }
}
class RemoteWikiStorage implements WikiStorage {
  mode = 'remote' as const;
  constructor(public urlBase: string) {}
  async readFile(path: string): Promise<WikiFile | null> {
    try {
      const response = await axios.get(this.urlBase + path);
      return {
        content: Buffer.from(response.data.content, 'base64').toString(),
        sha: response.data.sha
      };
    } catch (error) {
      if ((error as { response?: { status: number } }).response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}

let storage: WikiStorage | undefined;

export function getStorage(): WikiStorage {
  if (!storage) {
    const url =
      process.env.WIKI_STORAGE_URL ||
      (!fs.existsSync('wiki')
        ? 'https://directcommit.spacet.me/api/mountpoints/creatorsgarten-wiki/contents/'
        : '');
    storage = url ? new RemoteWikiStorage(url) : new LocalWikiStorage();
  }
  return storage;
}

function getIndex() {
  return query('index', async () => {
    const file = await getStorage().readFile('index.json');
    if (!file) {
      throw new Error(`Unable to find index.json`);
    }
    const index = JSON.parse(file.content);
    return index;
  });
}

export async function getPage(slug: string): Promise<PageData | Redirect> {
  if (slug === 'Special/AllPages') {
    const index = await getIndex();
    const pages = index.pages;
    return {
      content:
        'All pages!\n\n' +
        Object.keys(pages)
          .sort()
          .map((k) => {
            const page = pages[k];
            const name = page?.name;
            const append = name ? ` (${name})` : '';
            return `- [${k}](/wiki/${k})${append}`;
          })
          .join('\n'),
      mode: 'generated'
    };
  }

  const path = `wiki/${slug}.md`;
  const page = await getStorage().readFile(path);
  if (!page) {
    const index = await getIndex();
    const pages = index.pages;
    const foundSlug = Object.keys(pages).find((k) => k.toLowerCase() === slug.toLowerCase());
    if (foundSlug && slug !== foundSlug) {
      return {
        redirect: { newSlug: foundSlug }
      };
    }
  }
  return {
    content: page?.content || null,
    sha: page?.sha,
    mode: 'local'
  };
}
