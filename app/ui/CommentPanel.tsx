import React, { useState } from 'react';
import type { Comments } from '../types';

type Props = {
  comments: Comments;
  onAdd: (url: string) => void;
};

const CommentPanel: React.FC<Props> = ({ comments, onAdd }) => {
  const [url, setUrl] = useState('');

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.links.map((l) => (
          <li key={l.id}>
            <a href={l.messageUrl} target="_blank" rel="noreferrer">
              {l.summary || l.messageUrl}
            </a>
          </li>
        ))}
      </ul>
      <div>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Slack message URL"
        />
        <button
          onClick={() => {
            if (url.trim()) {
              onAdd(url.trim());
              setUrl('');
            }
          }}
        >
          Add
        </button>
      </div>
    </div>
  );

};

export default CommentPanel;
