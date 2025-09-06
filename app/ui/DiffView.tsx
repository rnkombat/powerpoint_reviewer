import React from 'react';
import type { SlideDiff } from '../core/DiffEngine';

type Props = { diffs: SlideDiff[] };

const DiffView: React.FC<Props> = ({ diffs }) => {
  return (
    <div>
      <h3>差分結果</h3>
      <ul>
        {diffs.map((d, i) => (
          <li key={i}>
            {(() => {
              switch (d.type) {
                case 'added':
                  return `スライド${d.indexNew}が追加`;
                case 'removed':
                  return `スライド${d.indexOld}が削除`;
                case 'moved':
                  return `スライド${d.indexOld}->${d.indexNew}に移動`;
                case 'unchanged':
                  return `スライド${d.indexOld}に変更なし`;
                case 'edited':
                  return `スライド${d.indexOld}が編集`; // element details omitted
                default:
                  return '';
              }
            })()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiffView;
