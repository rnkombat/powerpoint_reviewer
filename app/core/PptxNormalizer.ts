import type { Manifest, ManifestElement } from '../types';

export type NormalizedSlide = {
  index: number;
  elements: ManifestElement[];
};

export interface PptxNormalizer {
  normalize(pptx: ArrayBuffer): Promise<NormalizedSlide[]>;
  toManifest(docId: string, rev: number, slides: NormalizedSlide[]): Manifest;
}
