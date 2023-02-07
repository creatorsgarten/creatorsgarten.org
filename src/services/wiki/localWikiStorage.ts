import fs from 'fs'
import crypto from 'crypto'

import type { WikiStorage } from "$types/WikiStorage"
import type { WikiFile } from '$types/WikiFile';

export class LocalWikiStorage implements WikiStorage {
  mode = 'local' as const;

  async readFile(path: string): Promise<WikiFile | null> {
    try {
      const buffer = await fs.promises.readFile(`wiki/${path}`, 'utf8');

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
