---
title: 'auslaw-mcp'
description: 'Semantic search for Australian case law. Plain-language queries, actual judgments returned.'
link: 'https://github.com/russellbrenner/auslaw-mcp'
github: 'https://github.com/russellbrenner/auslaw-mcp'
tags: ['Legal AI', 'RAG', 'MCP', 'Australian Law']
types: [open-source]
order: 1
---

## The problem

Legal research tools are built around keyword search. If you know the citation, you can find the case. If you know the exact phrase a court used, you can search for it. But if you're trying to answer a conceptual question — "when does a duty of care arise for pure economic loss?" — keyword search forces you to already know the answer well enough to formulate the right query. That's backwards.

General-purpose embedding models make it worse. They treat legal text as ordinary prose and miss the signals that matter: citation hierarchies, the difference between "applied" and "distinguished," the structural markers that identify ratio decidendi versus obiter dictum.

## What it does

auslaw-mcp is a semantic search tool for Australian case law. You describe what you're looking for in plain English. It returns the actual judgments it retrieved — not a summary, not an AI-generated answer, the text — with citations.

- No login required
- No keyword guessing
- Family law, criminal, contract, tort, administrative: all covered
- Built on voyage-law-2 embeddings, trained on legal corpora rather than general text
- Integrated into AI agent sessions via the Model Context Protocol (MCP)

## Why it exists

Built for my own LLB study and legal AI work. The gap between what general search tools offer and what legal research actually requires was obvious within weeks of starting law school. The retrieval system needed to understand Australian legal document structure natively, not treat a judgment like a webpage.

Open-sourced because anyone doing Australian legal research deserves better tools.
