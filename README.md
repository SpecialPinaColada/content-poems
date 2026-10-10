# Content repo

Put one poem per file in `poems/`. Spacing and indentation are kept exactly as typed.

```
---
title: My Poem
date: 2026-10-01
tags: [poem]        # first tag is the label above the title; all tags become filters
draft: true         # optional: hides the poem
credit: |           # optional: adds a credit line, continues till end of indent, respects newlines
  the two lines
  will show as credits
featured: true      #feature this poem as the main one when you open the page
quote: |            # optional: the main text to display when featured
    The intro lines to this poem
    Or anything else you want
---
First line
    indented line
```

Pushing changes to `poems/` runs the GitHub Action, which rebuilds `index.json` and allows the actual page builder to index and render poems.
