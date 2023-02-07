import fs from 'fs'

import { LocalWikiStorage } from "./localWikiStorage";
import { RemoteWikiStorage } from "./remoteWikiStorage";

import type { WikiStorage } from "$types/WikiStorage";

declare global {
  // allow global `var` declarations
  var storage: WikiStorage;
}

export const getStorage = (): WikiStorage => {
  if (!global.storage) {
    const url =
      process.env.WIKI_STORAGE_URL ||
      (!fs.existsSync('wiki')
        ? 'https://directcommit.spacet.me/api/mountpoints/creatorsgarten-wiki/contents/'
        : '');
      global.storage = url ? new RemoteWikiStorage(url) : new LocalWikiStorage();
  }
  return global.storage;
}
