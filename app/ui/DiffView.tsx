import React from 'react';
import type { Manifest } from '../types';
import type { SlideDiff, ElementChange } from '../core/DiffEngine';
import SlideCanvas from './SlideCanvas';

type Props = {
  diffs: SlideDiff[];
  manifestA: Manifest;
  manifestB: Manifest;
};

const DiffView: React.FC<Props> = ({ diffs, manifestA, manifestB }) => {
  const changed = diffs.filter((d) => d.type !== 'unchanged');
  return (
    <div className="diff-view">
      {changed.map((d, i) => {
        const oldSlide = 'indexOld' in d ? manifestA.slides[d.indexOld] : undefined;
        const newSlide = 'indexNew' in d ? manifestB.slides[d.indexNew] : undefined;

        let changes: ElementChange[] | undefined;
        if (d.type === 'edited' && 'elements' in d) {
          changes = d.elements;
        } else if (d.type === 'added' && newSlide) {
          changes = newSlide.elements.map((el) => ({ type: 'added', after: el }));
        } else if (d.type === 'removed' && oldSlide) {
          changes = oldSlide.elements.map((el) => ({ type: 'removed', before: el }));
        }

        return (
          <div key={i} className={`diff-row ${d.type}`}>
            <div className="slide-col">
              <h4>旧</h4>
              <SlideCanvas slide={oldSlide} changes={changes} />
            </div>
            <div className="slide-col">
              <h4>新</h4>
              <SlideCanvas slide={newSlide} changes={changes} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DiffView;
