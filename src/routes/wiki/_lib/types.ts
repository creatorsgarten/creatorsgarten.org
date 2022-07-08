export interface PageData {
  content: string | null;
  mode: 'local' | 'remote' | 'preview';
  sha?: string;
}
