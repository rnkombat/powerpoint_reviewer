import { diff_match_patch } from 'diff-match-patch';
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

/**
 * Basic implementation of DiffEngine performing slide-level LCS matching and
 * element-level diffing keyed by stable IDs.
 */
export class BasicDiffEngine implements DiffEngine {
  diffManifests(a: Manifest, b: Manifest): SlideDiff[] {
    const result: SlideDiff[] = [];
    const oldHashes = a.slides.map((s) => s.hash);
    const newHashes = b.slides.map((s) => s.hash);
    const lcs = computeLcs(oldHashes, newHashes);

    let i = 0;
    let j = 0;
    let k = 0;
    while (i < a.slides.length || j < b.slides.length) {
      if (
        i < a.slides.length &&
        j < b.slides.length &&
        k < lcs.length &&
        a.slides[i].hash === lcs[k] &&
        b.slides[j].hash === lcs[k]
      ) {
        const indexOld = i;
        const indexNew = j;
        if (i === j) {
          result.push({ type: 'unchanged', indexOld, indexNew });
        } else {
          result.push({ type: 'moved', indexOld, indexNew });
        }
        i++;
        j++;
        k++;
      } else if (k < lcs.length && j < b.slides.length && b.slides[j].hash === lcs[k]) {
        result.push({ type: 'removed', indexOld: i });
        i++;
      } else if (k < lcs.length && i < a.slides.length && a.slides[i].hash === lcs[k]) {
        result.push({ type: 'added', indexNew: j });
        j++;
      } else if (i < a.slides.length && j < b.slides.length) {
        const elements = diffElements(a.slides[i].elements, b.slides[j].elements);
        result.push({ type: 'edited', indexOld: i, indexNew: j, elements });
        i++;
        j++;
      } else if (j < b.slides.length) {
        result.push({ type: 'added', indexNew: j });
        j++;
      } else if (i < a.slides.length) {
        result.push({ type: 'removed', indexOld: i });
        i++;
      }
    }

    return result;
  }
}

function computeLcs(a: string[], b: string[]): string[] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const res: string[] = [];
  let i = 0,
    j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      res.push(a[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return res;
}

function diffElements(aEls: ManifestElement[], bEls: ManifestElement[]): ElementChange[] {
  const result: ElementChange[] = [];
  const mapB = new Map<string, ManifestElement>(bEls.map((e) => [e.id, e]));
  const dmp = new diff_match_patch();

  for (const eA of aEls) {
    const eB = mapB.get(eA.id);
    if (eB) {
      mapB.delete(eA.id);
      if (JSON.stringify(eA) === JSON.stringify(eB)) {
        result.push({ type: 'unchanged', before: eA, after: eB });
      } else {
        const sub: SubChange = {};
        if (eA.props.textNorm !== eB.props.textNorm) {
          const diffs = dmp.diff_main(eA.props.textNorm || '', eB.props.textNorm || '');
          dmp.diff_cleanupSemantic(diffs);
          const chunks = diffs.map(([op, text]) => ({
            op: op === 0 ? '=' : op === -1 ? '-' : '+',
            text
          }));
          sub.text = {
            before: eA.props.textNorm || '',
            after: eB.props.textNorm || '',
            chunks
          };
        }
        if (eA.props.blobHash !== eB.props.blobHash) {
          sub.image = { beforeHash: eA.props.blobHash, afterHash: eB.props.blobHash };
        }
        if (eA.props.styleKey !== eB.props.styleKey) {
          sub.style = { before: eA.props.styleKey, after: eB.props.styleKey };
        }
        if (
          eA.geom.x !== eB.geom.x ||
          eA.geom.y !== eB.geom.y ||
          eA.geom.w !== eB.geom.w ||
          eA.geom.h !== eB.geom.h
        ) {
          sub.geom = { before: eA.geom, after: eB.geom };
        }
        result.push({ type: 'edited', before: eA, after: eB, sub });
      }
    } else {
      result.push({ type: 'removed', before: eA });
    }
  }

  for (const eB of mapB.values()) {
    result.push({ type: 'added', after: eB });
  }

  return result;
}
