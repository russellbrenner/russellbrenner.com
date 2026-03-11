---
title: 'AI Agent Orchestration'
description: 'Multi-host platform coordinating Claude Code sessions with real-time LLM supervision.'
github: 'https://github.com/russellbrenner'
tags: ['AI Infrastructure', 'Agent Orchestration', 'MCP', 'TypeScript']
types: ['personal']
order: 4
---

## The problem

Running AI coding agents unsupervised across multiple hosts is a recipe for runaway sessions, wasted compute, and destructive mistakes. When agents operate on real infrastructure — deploying to Kubernetes, modifying configurations, managing databases — you need the same operational controls you'd apply to any production system: health monitoring, automatic escalation, and the ability to pause or kill a session before it causes damage.

The other problem: every session starts cold. Without persistent context, agents repeat the same discovery work, make the same mistakes, and lose institutional knowledge between sessions.

## What it does

A multi-host platform that treats AI agent sessions as first-class workloads with real-time oversight.

**Supervision layer.** Every session's output streams through an LLM classifier that catches failure patterns simple heuristics miss. An agent stuck in a retry loop looks active by process metrics; the supervisor recognises the repetition and escalates. Notifications arrive only when something actually needs attention.

**42 custom skills.** Reusable agent workflows for deployment, debugging, plan execution, code review, memory management, and a dozen other operational procedures. Each skill is a version-controlled specification that agents load at session start. Context engineering as infrastructure.

**50+ MCP tools.** Custom Model Context Protocol server spanning secrets management, source control, project management, document search, and infrastructure queries. The connective tissue between agent sessions and the production systems they operate on.

**OpenMemory integration.** Persistent cross-session memory. Agents accumulate context across hundreds of sessions rather than starting from scratch each time.

**Observability dashboard.** Real-time session state, task progress, hook-based event ingestion, and agent health. Built by agents running on the platform — every deployment bug was immediately felt.

## Why it exists

One infrastructure person operating 90+ production services, writing software, studying law, and building three legal AI products simultaneously. The agent platform is what makes that possible. Without it, every session would be isolated, every agent would be unsupervised, and the operational overhead would dominate the actual work.

The tools used to build the tools.
