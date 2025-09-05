import { promises as fs } from 'fs';
import path from 'path';
import type { Manifest, RevGraph, Comments } from '../types';
import type { SidecarStore } from './SidecarStore';

/**
 * A SidecarStore implementation that persists JSON files to the local
 * filesystem. This is primarily for development and testing; the real app
 * would use Google Drive's App Folder.
 */
export class FsSidecarStore implements SidecarStore {
  constructor(private baseDir: string) {}

  private docDir(docId: string): string {
    return path.join(this.baseDir, docId);
  }

  private async readJson<T>(p: string): Promise<T | null> {
    try {
      const content = await fs.readFile(p, 'utf-8');
      return JSON.parse(content) as T;
    } catch {
      return null;
    }
  }

  private async writeJson(p: string, data: any): Promise<void> {
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf-8');
  }

  async loadManifest(docId: string, rev: number): Promise<Manifest | null> {
    const p = path.join(this.docDir(docId), `manifest@rev-${rev}.json`);
    return this.readJson<Manifest>(p);
  }

  async saveManifest(docId: string, manifest: Manifest): Promise<void> {
    const p = path.join(this.docDir(docId), `manifest@rev-${manifest.rev}.json`);
    await this.writeJson(p, manifest);
  }

  async loadRevGraph(docId: string): Promise<RevGraph | null> {
    const p = path.join(this.docDir(docId), 'revgraph.json');
    return this.readJson<RevGraph>(p);
  }

  async saveRevGraph(docId: string, graph: RevGraph): Promise<void> {
    const p = path.join(this.docDir(docId), 'revgraph.json');
    await this.writeJson(p, graph);
  }

  async loadComments(docId: string): Promise<Comments | null> {
    const p = path.join(this.docDir(docId), 'comments.json');
    return this.readJson<Comments>(p);
  }

  async saveComments(docId: string, comments: Comments): Promise<void> {
    const p = path.join(this.docDir(docId), 'comments.json');
    await this.writeJson(p, comments);
  }
}
