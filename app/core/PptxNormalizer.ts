import JSZip from 'jszip';
import type { Manifest, ManifestElement } from '../types';
import { sha256 } from '../utils/crypto';

export type NormalizedSlide = {
  index: number;
  elements: ManifestElement[];

  hash: string;
  titleText?: string;
};

export interface PptxNormalizer {
  normalize(pptx: ArrayBuffer): Promise<NormalizedSlide[]>;
  toManifest(docId: string, rev: number, slides: NormalizedSlide[]): Manifest;
}

/**
 * Basic PPTX normalizer that extracts text boxes from slide XMLs and assigns
 * content-based stable IDs. Geometry and styles are omitted for brevity but
 * placeholders are returned to satisfy the Manifest schema.
 */
export class BasicPptxNormalizer implements PptxNormalizer {
  async normalize(pptx: ArrayBuffer): Promise<NormalizedSlide[]> {
    const zip = await JSZip.loadAsync(pptx);
    const slideFiles = Object.keys(zip.files)
      .filter((f) => f.startsWith('ppt/slides/slide') && f.endsWith('.xml'))
      .sort();

    const slides: NormalizedSlide[] = [];
    for (let i = 0; i < slideFiles.length; i++) {
      const xml = await zip.file(slideFiles[i])!.async('string');
      const elements: ManifestElement[] = [];
      const textMatches = [...xml.matchAll(/<a:t[^>]*>(.*?)<\/a:t>/g)];
      for (const match of textMatches) {
        const textNorm = match[1].replace(/\s+/g, ' ').trim();
        const id = await sha256(`textbox|${textNorm}`);
        elements.push({
          id,
          kind: 'textbox',
          geom: { x: 0, y: 0, w: 0, h: 0 },
          props: { textNorm }
        });
      }
      const hash = await sha256(elements.map((e) => e.id).sort().join('|'));
      slides.push({ index: i, elements, hash, titleText: elements[0]?.props.textNorm });
    }
    return slides;
  }

  toManifest(docId: string, rev: number, slides: NormalizedSlide[]): Manifest {
    return {
      docId,
      rev,
      createdAt: new Date().toISOString(),
      slideCount: slides.length,
      slides: slides.map((s) => ({
        index: s.index,
        hash: s.hash,
        titleText: s.titleText,
        elements: s.elements
      }))
    };
  }
}
