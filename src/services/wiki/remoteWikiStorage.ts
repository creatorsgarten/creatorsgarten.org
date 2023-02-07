import axios from 'axios'

import type { WikiFile } from "$types/WikiFile";
import type { WikiStorage } from "$types/WikiStorage";

export class RemoteWikiStorage implements WikiStorage {
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
