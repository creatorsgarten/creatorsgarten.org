import fs from 'fs';
import axios from 'axios';
import crypto from 'crypto';

interface WikiStorage {
  mode: 'local' | 'remote' | 'preview';
  read(slug: string): Promise<WikiFile | null>;
}

interface WikiFile {
  content: string;
  sha: string;
}

class LocalWikiStorage implements WikiStorage {
  mode = 'local' as const;
  async read(slug: string): Promise<WikiFile | null> {
    try {
      const buffer = fs.readFileSync(`wiki/${slug}.md`, 'utf8');
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
  async read(slug: string): Promise<WikiFile | null> {
    try {
      const response = await axios.get(this.urlBase + slug + '.md');
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

function getStorage(): WikiStorage {
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

export async function getPage(slug: string): Promise<PageData> {
  const page = await getStorage().read(slug);
  return {
    content: page?.content || null,
    sha: page?.sha,
    mode: 'local'
  };
}

export interface PageData {
  content: string | null;
  mode: 'local' | 'remote' | 'preview';
  sha?: string;
}
