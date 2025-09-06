import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Timeline from './Timeline';
import DiffView from './DiffView';
import CommentPanel from './CommentPanel';
import { BasicDiffEngine } from '../core/DiffEngine';
import type { SlideDiff } from '../core/DiffEngine';
import type { Comments } from '../types';
import { manifestA, manifestB, sampleComments } from '../sample/sampleData';

function App() {
  const [diffs, setDiffs] = useState<SlideDiff[] | null>(null);
  const [comments, setComments] = useState<Comments>(sampleComments);

  const loadDemo = () => {
    const engine = new BasicDiffEngine();
    const d = engine.diffManifests(manifestA, manifestB);
    setDiffs(d);
  };

  const addComment = (url: string) => {
    setComments((prev) => ({
      links: [
        ...prev.links,
        {
          id: `c${prev.links.length + 1}`,
          rev: 2,
          slideIndex: 0,
          source: 'manual',
          messageUrl: url,
          createdAt: new Date().toISOString()
        }
      ]
    }));
  };

  return (
    <div>
      <h1>SlideGit デモ</h1>
      <Timeline onLoadDemo={loadDemo} />
      {diffs && (
        <>
          <DiffView diffs={diffs} />
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
