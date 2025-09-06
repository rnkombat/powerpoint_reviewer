import React from 'react';

type Props = { onLoadDemo: () => void };

const Timeline: React.FC<Props> = ({ onLoadDemo }) => {
  return (
    <div>
      <button onClick={onLoadDemo}>サンプル差分を読み込む</button>
    </div>
  );

};

export default Timeline;
