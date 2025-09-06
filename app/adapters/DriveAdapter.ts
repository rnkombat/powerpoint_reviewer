export interface DriveAdapter {
  pickFile(): Promise<{ docId: string; name: string }>;
  listRevisions(docId: string): Promise<Array<{ rev: number; createdAt: string; author?: string }>>;
  getRevisionPptx(docId: string, rev: number): Promise<ArrayBuffer>;
  readAppFile(docId: string, path: string): Promise<string | null>;
  writeAppFile(docId: string, path: string, content: string): Promise<void>;
  ensureAppFolder(docId: string): Promise<void>;
}
