---
title: 'auslaw-mcp'
description: 'Plain-language semantic search for Australian case law. Built for legal research, open for everyone.'
link: 'https://github.com/russellbrenner/auslaw-mcp'
github: 'https://github.com/russellbrenner/auslaw-mcp'
tags: ['Legal AI', 'Semantic Search', 'MCP', 'Australian Law', 'Open Source']
types: [open-source]
order: 1
---

## The problem

Legal research tools are built around keyword search. If you know the citation, you can find the case. If you know the exact phrase a judge used, you can search for it. But if you're trying to answer a conceptual question — "when does a duty of care arise for pure economic loss?" — keyword search forces you to already know the answer well enough to formulate the right query.

That's backwards.

## What it does

auslaw-mcp is a semantic search engine for Australian case law. You describe what you're looking for in plain English. It returns the actual judgments — not summaries, not AI-generated answers, the real text — with citations.

**Core capabilities:**

- Natural language queries across all Australian jurisdictions and New Zealand
- Case name detection: automatically distinguishes "Donoghue v Stevenson" from topic searches
- Authority-aware ranking: High Court decisions rank above lower courts
- Citation extraction: pulls neutral citations `[2025] HCA 26` and reported citations `(2024) 350 ALR 123`
- AGLC4 citation formatting: generates pinpoint citations per AGLC4 rules
- Full-text retrieval from AustLII and jade.io with paragraph markers preserved
- OCR fallback for scanned PDFs
- SSRF protection and rate limiting for production use

**Integration:**

- MCP server for AI agent sessions
- REST API for direct integration
- Docker and Kubernetes deployment manifests included

## Why it exists

Built during my LLB at Swinburne. The gap between what general search tools offer and what legal research actually requires was obvious within weeks. The retrieval system needed to understand Australian legal document structure natively, not treat a judgment like ordinary prose.

Open-sourced because anyone doing Australian legal research deserves better tools.

## Status

Live and open source. Actively maintained.
