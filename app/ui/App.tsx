import React from 'react';
import { createRoot } from 'react-dom/client';
import Timeline from './Timeline';

function App() {
  return (
    <div>
      <h1>SlideGit</h1>
      <Timeline />
    </div>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}

export default App;
