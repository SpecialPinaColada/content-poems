# Content repo

Put one poem per file in `poems/`. Spacing and indentation are kept exactly as typed.

```
---
title: My Poem
date: 2026-10-01
tags: [poem]        # first tag is the label above the title; all tags become filters
draft: true         # optional: hides the poem
---
First line
    indented line
```

Pushing changes to `poems/` runs the GitHub Action, which rebuilds `index.json`.
Make the repo public. To use a CMS (Decap, Tina), point it at this repo's `poems/` folder.
