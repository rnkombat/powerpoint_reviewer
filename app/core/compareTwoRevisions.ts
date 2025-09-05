import type { DriveAdapter } from '../adapters/DriveAdapter';
import type { SidecarStore } from '../adapters/SidecarStore';
import type { PptxNormalizer } from './PptxNormalizer';
import type { DiffEngine, SlideDiff } from './DiffEngine';
import type { Manifest } from '../types';

/**
 * Compare two revisions of a PPTX document.
 *
 * This orchestrates fetching PPTX binaries, building or loading manifests,
 * computing diffs and caching results into the sidecar store.
 */
export async function compareTwoRevisions(
  docId: string,
  revA: number,
  revB: number,
  deps: {
    drive: DriveAdapter;
    normalizer: PptxNormalizer;
    diff: DiffEngine;
    sidecar: SidecarStore;
  }
): Promise<{ mA: Manifest; mB: Manifest; diffs: SlideDiff[] }> {
  const { drive, normalizer, diff: diffEngine, sidecar } = deps;

  // Fetch both revisions in parallel
  const [pptxA, pptxB] = await Promise.all([
    drive.getRevisionPptx(docId, revA),
    drive.getRevisionPptx(docId, revB)
  ]);

  // Build or load manifests for each revision
  const [mA, mB] = await Promise.all([
    loadOrBuildManifest(docId, revA, pptxA, normalizer, sidecar),
    loadOrBuildManifest(docId, revB, pptxB, normalizer, sidecar)
  ]);

  // Compute diffs
  const diffs = diffEngine.diffManifests(mA, mB);

  // Persist manifests for future runs
  await Promise.all([
    sidecar.saveManifest(docId, mA),
    sidecar.saveManifest(docId, mB)
  ]);

  return { mA, mB, diffs };
}

async function loadOrBuildManifest(
  docId: string,
  rev: number,
  pptx: ArrayBuffer,
  normalizer: PptxNormalizer,
  sidecar: SidecarStore
): Promise<Manifest> {
  const cached = await sidecar.loadManifest(docId, rev);
  if (cached) return cached;

  const slides = await normalizer.normalize(pptx);
  return normalizer.toManifest(docId, rev, slides);
}
