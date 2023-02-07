export interface PageData {
  content: string | null;
  mode: 'local' | 'remote' | 'preview' | 'generated';
  sha?: string;
}
