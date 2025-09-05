export type ElementKind = 'textbox' | 'image' | 'shape';

export type ManifestElement = {
  id: string;
  kind: ElementKind;
  geom: { x: number; y: number; w: number; h: number };
  props: {
    textNorm?: string;
    styleKey?: string;
    blobHash?: string;
    shapeType?: string;
  };
};

export type ManifestSlide = {
  index: number;
  hash: string;
  titleText?: string;
  elements: ManifestElement[];
};

export type Manifest = {
  docId: string;
  rev: number;
  createdAt: string;
  slideCount: number;
  slides: ManifestSlide[];
};

export type RevGraph = {
  nodes: Array<{ rev: number; label?: string; author?: string; createdAt?: string }>;
  edges: Array<{ from: number; to: number; type: 'linear' | 'merge' | 'branch' }>;
  pins: number[];
};

export type CommentLink = {
  id: string;
  rev: number;
  slideIndex: number;
  anchor?: string;
  source: 'slack' | 'teams' | 'manual';
  messageUrl: string;
  ts?: string;
  author?: string;
  summary?: string;
  createdAt: string;
};

export type Comments = { links: CommentLink[] };
