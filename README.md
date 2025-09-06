# powerpoint_reviewer

Prototype project for SlideGit, a DB-less PPTX comparison and review tool.

This repository contains a minimal Electron + React + TypeScript skeleton based on the project specification.

## Core workflow

The revision comparison flow is implemented in `app/core/compareTwoRevisions.ts`.
It fetches PPTX revisions, builds manifests, computes diffs, and caches results
through a pluggable `SidecarStore`. A filesystem-backed store implementation
is provided at `app/adapters/FsSidecarStore.ts` for local development.

For Slack integration, a polling adapter lives at
`app/adapters/PollingSlackAdapter.ts`. It connects using a user-provided token
and periodically fetches channel histories to surface messages that reference
slides or elements.


## Development

```
npm install
npm run dev
```

## Testing

```
npm test
```
