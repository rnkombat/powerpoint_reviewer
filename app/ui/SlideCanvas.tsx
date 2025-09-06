import React from 'react';
import type { ManifestSlide } from '../types';
import type { ElementChange } from '../core/DiffEngine';

interface Props {
  slide?: ManifestSlide;
  changes?: ElementChange[];
}

const SlideCanvas: React.FC<Props> = ({ slide, changes }) => {
  const width = 480;
  const height = 270;
  const scaleX = width / 960;
  const scaleY = height / 540;

  if (!slide) {
    return <div className="slide-canvas empty" style={{ width, height }}>なし</div>;
  }

  const changeMap = new Map<string, ElementChange["type"]>();
  changes?.forEach((c) => {
    const id = c.type === 'added' ? c.after.id : c.before.id;
    changeMap.set(id, c.type);
  });

  return (
    <div className="slide-canvas" style={{ width, height }}>
      {slide.elements.map((el) => {
        const ch = changeMap.get(el.id);
        return (
          <div
            key={el.id}
            className={`elem ${el.kind} ${ch || ''}`}
            style={{
              left: el.geom.x * scaleX,
              top: el.geom.y * scaleY,
              width: el.geom.w * scaleX,
              height: el.geom.h * scaleY,
            }}
          >
            {el.kind === 'textbox' ? el.props.textNorm : el.kind}
          </div>
        );
      })}
    </div>
  );
};

export default SlideCanvas;
