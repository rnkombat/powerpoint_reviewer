import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import DiffView from './DiffView';
import CommentPanel from './CommentPanel';
import { BasicDiffEngine } from '../core/DiffEngine';
import { BasicPptxNormalizer } from '../core/PptxNormalizer';
import type { SlideDiff } from '../core/DiffEngine';
import type { Manifest, Comments } from '../types';
import { manifestA as sampleA, manifestB as sampleB, sampleComments } from '../sample/sampleData';
import './styles.css';

function App() {
  const [manifestA, setManifestA] = useState<Manifest | null>(null);
  const [manifestB, setManifestB] = useState<Manifest | null>(null);
  const [diffs, setDiffs] = useState<SlideDiff[] | null>(null);
  const [comments, setComments] = useState<Comments>({ links: [] });

  const handleFile = async (file: File, setter: (m: Manifest) => void) => {
    const array = await file.arrayBuffer();
    const normalizer = new BasicPptxNormalizer();
    const slides = await normalizer.normalize(array);
    const manifest = normalizer.toManifest('local', Date.now(), slides);
    setter(manifest);
  };

  useEffect(() => {
    if (manifestA && manifestB) {
      const engine = new BasicDiffEngine();
      setDiffs(engine.diffManifests(manifestA, manifestB));
    }
  }, [manifestA, manifestB]);

  const addComment = (url: string) => {
    setComments((prev) => ({
      links: [
        ...prev.links,
        {
          id: `c${prev.links.length + 1}`,
          rev: 0,
          slideIndex: 0,
          source: 'manual',
          messageUrl: url,
          createdAt: new Date().toISOString()
        }
      ]
    }));
  };

  return (
    <div className="app">
      <h1>SlideGit デモ</h1>
      <div className="upload-area">
        <div>
          <label>旧版PPTX</label>
          <input type="file" accept=".pptx" onChange={(e) => e.target.files && handleFile(e.target.files[0], setManifestA)} />
        </div>
        <div>
          <label>新版PPTX</label>
          <input type="file" accept=".pptx" onChange={(e) => e.target.files && handleFile(e.target.files[0], setManifestB)} />
        </div>
        <button onClick={() => {
          setManifestA(sampleA);
          setManifestB(sampleB);
          setComments(sampleComments);
        }}>サンプル差分を読み込む</button>
      </div>
      {diffs && manifestA && manifestB && (
        <>
          <DiffView diffs={diffs} manifestA={manifestA} manifestB={manifestB} />
          <CommentPanel comments={comments} onAdd={addComment} />
        </>
      )}
    </div>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}

export default App;
