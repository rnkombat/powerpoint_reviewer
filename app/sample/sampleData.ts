import type { Manifest, Comments } from '../types';

export const manifestA: Manifest = {
  docId: 'demo',
  rev: 1,
  createdAt: '2023-01-01T00:00:00Z',
  slideCount: 2,
  slides: [
    {
      index: 0,
      hash: 'slide-hello',
      elements: [
        {
          id: 'txt-hello',
          kind: 'textbox',
          geom: { x: 0, y: 0, w: 100, h: 20 },
          props: { textNorm: 'Hello' }
        }
      ]
    },
    {
      index: 1,
      hash: 'slide-img',
      elements: [
        {
          id: 'img-1',
          kind: 'image',
          geom: { x: 0, y: 0, w: 100, h: 100 },
          props: { blobHash: 'imgA' }
        }
      ]
    }
  ]
};

export const manifestB: Manifest = {
  docId: 'demo',
  rev: 2,
  createdAt: '2023-01-02T00:00:00Z',
  slideCount: 3,
  slides: [
    {
      index: 0,
      hash: 'slide-hello-mod',
      elements: [
        {
          id: 'txt-hello',
          kind: 'textbox',
          geom: { x: 0, y: 0, w: 100, h: 20 },
          props: { textNorm: 'Hello world' }
        }
      ]
    },
    {
      index: 1,
      hash: 'slide-img',
      elements: [
        {
          id: 'img-1',
          kind: 'image',
          geom: { x: 0, y: 0, w: 100, h: 100 },
          props: { blobHash: 'imgA' }
        }
      ]
    },
    {
      index: 2,
      hash: 'slide-new',
      elements: [
        {
          id: 'shape-1',
          kind: 'shape',
          geom: { x: 10, y: 10, w: 50, h: 50 },
          props: { shapeType: 'rect', styleKey: 'style1' }
        }
      ]
    }
  ]
};

export const sampleComments: Comments = {
  links: [
    {
      id: 'c1',
      rev: 2,
      slideIndex: 0,
      anchor: 'element:textbox:txt-hello',
      source: 'manual',
      messageUrl: 'https://slack.example.com/archives/C1/p111',
      summary: '挨拶を更新',
      createdAt: '2023-01-02T00:00:00Z'
    }
  ]
};
