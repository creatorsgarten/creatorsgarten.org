import type { WikiFile } from "./WikiFile";

export interface WikiStorage {
  mode: 'local' | 'remote' | 'preview' | 'generated';
  readFile(path: string): Promise<WikiFile | null>;
}
