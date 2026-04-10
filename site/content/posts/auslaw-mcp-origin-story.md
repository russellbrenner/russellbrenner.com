---
title: 'Why I Built a Legal Search Engine'
description: Keyword search is backwards for legal research. Here's what I built instead, and why solicitors started reaching out unprompted.
pubDate: 2026-04-09
tags: [auslaw-mcp, legal-tech, australian-law, semantic-search]
featured: true
draft: true
---

I'm doing a law degree at Swinburne. Early in my first semester, I hit a wall with legal research. The databases work fine if you know what you're looking for. Got a citation? You can find the case. Know the exact phrase a judge used? You can search for it. But if you're trying to answer a conceptual question ("when does a duty of care arise for pure economic loss"), keyword search forces you to already know the answer well enough to formulate the right query.

That's backwards.

So I built what I needed: plain-language semantic search over Australian case law. You ask a question in English. It returns judgment text from cases that actually address your issue, ranked by semantic similarity, not keyword overlap.

I called it auslaw-mcp. Wrapped it as an MCP tool so my AI agents can search case law mid-conversation. Put it on GitHub. Forgot about it.

Then solicitors started contacting me. Unprompted. A family law solicitor in Melbourne found it through a search, tried it, and reached out to ask if I was planning to commercialise it. Then another. And another.

The feedback was consistent: "This does something the paid databases don't."

I didn't set out to build a legal tech product. I built a tool for my own studies because the existing options didn't work the way I needed them to. The fact that it resonates with practitioners tells me something about the gap between what legal research tools offer and what lawyers actually need.

The technical detail: voyage-law-2 embeddings (trained on legal corpora, not general text), citation-aware chunking that preserves judgment structure, pgvector on PostgreSQL for sub-300ms queries. Running on k3s. The code is AI-assisted. The architecture and operations are mine.

But the part I'm most proud of isn't the stack. It's that I recognised a problem I was qualified to solve, built the solution, and put it somewhere people could find it.

You can try it yourself. It's open source: [github.com/russellbrenner/auslaw-mcp](https://github.com/russellbrenner/auslaw-mcp)

#humanpost
