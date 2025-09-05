import type { Manifest, ManifestElement } from '../types';

export type SubChange = {
  text?: { before: string; after: string; chunks: Array<{ op: '=' | '-' | '+', text: string }> };
  image?: { beforeHash?: string; afterHash?: string };
  style?: { before: any; after: any };
  geom?: { before: any; after: any };
};

export type ElementChange =
  | { type: 'added'; after: ManifestElement }
  | { type: 'removed'; before: ManifestElement }
  | { type: 'moved'; before: ManifestElement; after: ManifestElement }
  | { type: 'edited'; before: ManifestElement; after: ManifestElement; sub: SubChange }
  | { type: 'unchanged'; before: ManifestElement; after: ManifestElement };

export type SlideDiff =
  | { type: 'added'; indexNew: number }
  | { type: 'removed'; indexOld: number }
  | { type: 'moved'; indexOld: number; indexNew: number }
  | { type: 'unchanged'; indexOld: number; indexNew: number }
  | { type: 'edited'; indexOld: number; indexNew: number; elements: ElementChange[] };

export interface DiffEngine {
  diffManifests(a: Manifest, b: Manifest): SlideDiff[];
}
