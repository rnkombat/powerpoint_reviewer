import type { Manifest, RevGraph, Comments } from '../types';

export interface SidecarStore {
  loadManifest(docId: string, rev: number): Promise<Manifest | null>;
  saveManifest(docId: string, manifest: Manifest): Promise<void>;
  loadRevGraph(docId: string): Promise<RevGraph | null>;
  saveRevGraph(docId: string, graph: RevGraph): Promise<void>;
  loadComments(docId: string): Promise<Comments | null>;
  saveComments(docId: string, comments: Comments): Promise<void>;
}
