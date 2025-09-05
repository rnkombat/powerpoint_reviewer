# powerpoint_reviewer

Prototype project for SlideGit, a DB-less PPTX comparison and review tool.

This repository contains a minimal Electron + React + TypeScript skeleton based on the project specification.

## Core workflow

The revision comparison flow is implemented in `app/core/compareTwoRevisions.ts`.
It fetches PPTX revisions, builds manifests, computes diffs, and caches results
through a pluggable `SidecarStore`. A filesystem-backed store implementation
is provided at `app/adapters/FsSidecarStore.ts` for local development.

## Development

```
npm install
npm run dev
```

## Testing

```
npm test
```
