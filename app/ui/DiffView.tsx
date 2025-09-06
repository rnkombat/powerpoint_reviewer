import React from 'react';
import type { Manifest } from '../types';
import type { SlideDiff, ElementChange } from '../core/DiffEngine';

type Props = {
  diffs: SlideDiff[];
  manifestA: Manifest;
  manifestB: Manifest;
};

const describeElement = (e: ElementChange) => {
  switch (e.type) {
    case 'added':
      return `要素${e.after.id}が追加`;
    case 'removed':
      return `要素${e.before.id}が削除`;
    case 'moved':
      return `要素${e.before.id}が移動`;
    case 'edited':
      return `要素${e.before.id}が編集`;
    case 'unchanged':
      return `要素${e.before.id}に変更なし`;
    default:
      return '';
  }
};

const DiffView: React.FC<Props> = ({ diffs, manifestA, manifestB }) => {
  const changed = diffs.filter((d) => d.type !== 'unchanged');
  return (
    <div className="diff-view">
      {changed.map((d, i) => {
        const oldSlide = 'indexOld' in d ? manifestA.slides[d.indexOld] : undefined;
        const newSlide = 'indexNew' in d ? manifestB.slides[d.indexNew] : undefined;
        return (
          <div key={i} className={`diff-row ${d.type}`}>
            <div className="slide-col">
              <h4>旧:</h4>
              {oldSlide ? <p>{oldSlide.titleText || `#${oldSlide.index}`}</p> : <p>なし</p>}
            </div>
            <div className="slide-col">
              <h4>新:</h4>
              {newSlide ? <p>{newSlide.titleText || `#${newSlide.index}`}</p> : <p>なし</p>}
            </div>
            {d.type === 'edited' && 'elements' in d && (
              <ul>
                {d.elements.map((e, idx) => (
                  <li key={idx} className={`element-change ${e.type}`}>{describeElement(e)}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DiffView;
