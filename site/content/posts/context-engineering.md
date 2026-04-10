---
title: 'Context Engineering: Making AI Agents Actually Useful at Scale'
description: What separates a useful AI agent from an expensive one isn't model capability. It's information architecture. Lessons from hundreds of Claude Code sessions running production infrastructure.
pubDate: 2026-03-05
tags: [ai-infrastructure, context-engineering, mcp, agent-orchestration]
featured: false
---

Most conversations about AI productivity focus on prompt engineering: how to phrase a question so the model gives a better answer. That's useful for single-turn interactions, but it falls apart the moment you try to run AI agents on real infrastructure. Prompt engineering is a per-query skill. Context engineering is information architecture for an entire working session.

The distinction matters because the failure mode of AI agents at scale is almost never model capability. It's context. The agent has the wrong information, too much information, or the right information buried where it can't find it. After hundreds of Claude Code sessions and over a thousand hours of AI-paired development across a homelab running 88 production services, the pattern is clear: context engineering is the skill that separates "I tried an AI coding tool" from "AI agents are a force multiplier for my infrastructure work."

## The U-Shaped Attention Curve

Large language models don't pay equal attention to every part of their context window. Research shows that attention follows a U-shaped curve: the beginning and end of the context receive strong focus, while the middle gets the weakest attention. This isn't a minor quirk. It's the single most important structural constraint for anyone designing agent-facing files.

In practice, this means a 300-line rules file has a dead zone in the middle. Instructions placed at line 150 are the most likely to be ignored. Critical rules need to be in the first 50 lines or the last 30. Everything else either needs to be linked (loaded on demand) or placed strategically at the boundaries.

My homelab's `CLAUDE.md` file, the primary context document that every agent session loads, follows this structure:

| Position               | Content                                                   | Why                                                                                  |
| ---------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Top 50 lines           | Non-negotiable rules, session startup protocol            | Maximum attention                                                                    |
| Top 100 lines          | Known failure mode table (symptom to root cause)          | High-frequency reference                                                             |
| Middle                 | Infrastructure reference, architecture tables             | Acceptable attention; structured data parses better than prose even in the dead zone |
| Second-to-last section | Context Router (what to read before working in each area) | Recency bias; the agent reads this just before starting work                         |
| Final section          | Priority declarations, closing anchor                     | Attention peak                                                                       |

This isn't theoretical. I tracked context engineering failures across sessions and found that 17 of 180 friction events were cases where the agent built the wrong thing because it missed or misinterpreted an instruction. The majority of those instructions were in the mid-context dead zone before I restructured the file.

## Writing for Machines, Not Humans

Documentation written for human readers and documentation written for AI agents look fundamentally different. Human readers tolerate prose, appreciate narrative flow, and can skim to the relevant paragraph. AI agents parse structured data more reliably, waste tokens on narrative padding, and perform worse when the same information could have been a table.

Here's the same information in two formats.

**Human-readable:**

> If you're working on the monitoring stack, you'll probably want to read the stack documentation and the alerting runbook first, since they contain important context about how our observability architecture is set up and what alerting thresholds we've configured.

**Machine-readable:**

```
| Working On | Read First |
|------------|------------|
| Monitoring / Prometheus / Grafana | docs/monitoring/stack.md, docs/monitoring/alerting-runbook.md |
```

The human version is 45 tokens. The table version is 20 tokens and parses more reliably under the attention curve. When you've got a 300-line rules file and every token counts, the choice is obvious.

This principle scales beyond rules files into application config. I'm building a study automation platform called celebrate that syncs with my university's Canvas LMS, manages assignment pipelines, and generates revision schedules. The entire platform's behaviour is defined in a single `celebrate.config.yaml`: Canvas API endpoints, assignment pipeline stages, scheduling constraints, content generation settings, spaced repetition parameters. That YAML file isn't just application config; it's machine-readable context. When an agent works on celebrate, it reads the config and immediately knows the pipeline stages (`detected > repo_setup > research > drafting > scheduled > ready > in_progress > review > submitted`), the Canvas API paths, the scheduling rules. No prose explanation needed. The config _is_ the documentation.

The general rules for machine-readable formatting:

- **Imperative language for rules.** "NEVER use SSH tunnelling" rather than "It's important to avoid SSH tunnelling because..."
- **Tables for structured data.** Comparative information, reference lookups, and decision matrices all belong in tables.
- **Exact references.** `docs/service-lifecycle.md` rather than "the service docs."
- **Concrete tool call syntax.** `openmemory_query("HANDOFF homelab", k=5)` rather than "check OpenMemory for handoff notes."
- **No embedded code walkthroughs.** Thought/Action/Observation example blocks cause the model to mimic them as text output instead of actually executing tools.
- **YAML over prose for multi-field config.** If you're defining pipeline stages, scheduling constraints, or API endpoints, a YAML block with typed fields beats a paragraph every time. Agents parse structured data natively; they have to _infer_ structure from prose.

## The Rules File as Infrastructure

The `CLAUDE.md` file is the most important context engineering artefact in any AI-augmented project. It's not documentation. It's infrastructure, in the same way a Dockerfile or a Terraform state file is infrastructure. It defines the operating environment for every agent session.

What belongs in it:

- **Architecture decisions** that affect every session (what runs where, how services connect, which tools to use)
- **Debugging protocols** with known root causes (symptom-to-fix lookup tables save enormous amounts of time)
- **Mandatory patterns** that agents must follow without exception (commit trailers, access rules, tool preferences)
- **A context router** that tells agents what to read before working in each area of the project

What doesn't belong in it:

- Session-specific details (those go in OpenMemory or handoff files)
- Speculative information or plans (those go in `plans/`)
- Explanations of why rules exist (move those to linked reference docs)
- External library documentation (use just-in-time retrieval via MCP tools like Context7)
- Credentials (reference 1Password paths, never inline secrets)

The homelab CLAUDE.md is approximately 300 lines at its core. That's at the ceiling. Beyond 300 lines, the mid-context dead zone becomes large enough that instructions start getting missed consistently. The solution isn't to accept the missed instructions; it's to split the file into a core routing document and linked reference files loaded on demand.

I use a two-file extension pattern: `CLAUDE-workflows.md` for common workflows (loaded by a `/catchup` command) and `CLAUDE-reference.md` for cold-path reference material (loaded by `/preflight`). The main `CLAUDE.md` stays lean and routes to them.

## Structured Data as Agent Context

One of the less obvious context engineering patterns is using application state as agent input, not just static rules files. When an n8n workflow polls the Canvas LMS API every 30 minutes and writes assignment data to PostgreSQL, that synced state becomes structured context that agents can query. The agent doesn't need to understand the Canvas API. It doesn't need to authenticate or paginate. It just reads the pipeline state: this assignment is in `research`, that one's in `drafting`, the next deadline is in 11 days.

This is a context engineering problem disguised as an integration problem. The naive approach would be to give the agent Canvas API credentials and let it poll directly. That's wasteful (repeated API calls, token-heavy JSON parsing, auth token management) and fragile (rate limits, pagination edge cases, session timeouts). The better approach: an n8n workflow handles the polling, normalises the data, and writes it somewhere the agent can read it cheaply. The agent's context stays lean. The external system's complexity is absorbed by the automation layer, not the agent's context window.

The celebrate platform takes this further. Each assignment moves through a nine-stage pipeline, and agents consume that pipeline state to decide what to do next. When an agent picks up an assignment in `research` stage, it knows to pull readings from the RAG API and draft an outline in Docmost. When it's in `review` stage, the agent knows to run quality checks against AGLC4 citation standards. The pipeline state _is_ the instruction. No separate prompt needed.

## Sub-Agent Communication via Filesystem

When you run multiple AI agents in parallel (an orchestrator dispatching sub-agents for different parts of a task), the naive approach is for sub-agents to return their findings as messages to the coordinator. This works until the findings are large. A sub-agent that returns 3,000 tokens of analysis inflates the coordinator's context by 3,000 tokens, and that cost compounds with every sub-agent.

The better pattern is filesystem-based communication:

```
Sub-agent task  -->  writes findings to scratch/agent-findings/[task-name].md
Coordinator     -->  reads the file (using the Read tool, not a message injection)
Result          -->  coordinator context contains only the file reference, not the full content
```

This keeps the coordinator's context clean. Findings persist across session compaction (they're on disk, not in the conversation history). Multiple sub-agents can work in parallel without the coordinator's context exploding. And the findings are reviewable by a human operator, which matters when agents are working on production infrastructure.

The anti-pattern to avoid: reasoning that "spawning a sub-agent adds latency with no benefit since the context is already available." The pattern exists for audit trail and context economy, not just for parallelism. Every time I've let an agent skip the filesystem dispatch pattern, the coordinator's context has degraded faster and the session has hit compaction sooner.

## Context Window Management

Long sessions are where context engineering either pays off or falls apart. A session that approaches the context window limit without a management strategy will start losing information. The model's behaviour degrades gradually, not suddenly: earlier instructions get weaker attention, previously established constraints get violated, and the agent starts repeating work it's already done.

Three strategies that work in practice:

**Structured compaction checkpoints.** Before every compaction event, a hook outputs a structured summary: session intent, files modified, decisions made, current state, next steps, and active constraints. This prevents the five most common post-compaction failures: repeating completed work, contradicting prior decisions, restarting instead of continuing, forgetting the original goal, and violating mid-session constraints.

**Tool output offloading.** When a tool returns more than 2,000 tokens (a `kubectl get` output, a Plane item list, a large grep result), write it to a scratch file and return only a summary to the context. The full data is still accessible if needed, but it's not consuming context window space while the agent reasons about the next step.

**Auto-memory persistence.** Facts that the agent learns during a session (infrastructure IPs, deployment patterns, failure modes) get written to memory files that persist across sessions. The `MEMORY.md` file acts as a concise index with detailed content split into topic-specific files. This means the next session doesn't need to rediscover the same information, and the current session can offload stable facts from active context.

## MCP Tools as Context Extension

The Model Context Protocol (MCP) solves a specific context engineering problem: how to give agents access to external systems without stuffing the context window with raw data from those systems.

Without MCP, an agent that needs to check a Plane project item would either require the full item data pre-loaded into context (wasteful) or would need to make raw API calls and parse JSON responses (fragile, token-heavy). With MCP, the agent calls `plane_get_item` and receives a structured response that the tool has already formatted for agent consumption.

The homelab integrates over 50 MCP tools across Plane (project management), 1Password (secrets), Gitea (source control), OPNsense (firewall), NetBox (IPAM), OpenMemory (persistent knowledge), and a custom RAG API (legal document search). Each tool is a context-efficient interface to an external system. The MCP server is my own, running on k3s, exposing all of these through a single deployment.

The critical constraint: MCP tool definitions themselves consume context. Each tool description is roughly 50-100 tokens, and 50 tools means 2,500-5,000 tokens of tool definitions loaded into every session. Beyond 30 tool definitions, agent accuracy measurably decreases. The solution is deferred loading: tools are registered but not loaded until the agent searches for them. Only the tools actually needed in a given session consume context space.

## Lessons from Hundreds of Sessions

Context engineering failures cluster into predictable categories. These are the ones I've seen most often, with the fixes that actually worked.

**The agent builds the wrong thing.** Root cause: ambiguous scope in the task description, combined with no scope confirmation protocol. Fix: a mandatory scope confirmation step in `CLAUDE.md` that requires the agent to restate the goal, identify affected files, and describe its approach before starting work. This single rule eliminated the most expensive failure mode.

**The agent ignores a mandatory instruction.** Root cause: the instruction was in the mid-context dead zone (lines 150-250 of a 300-line file). Fix: move the instruction to the top 100 lines or the last 30 lines, and convert prose to a table row for better parsing under low attention.

**The agent loses state during a long session.** Root cause: no compaction strategy. The session hit 70% context fill, compacted automatically, and lost critical state. Fix: the structured compaction checkpoint hook, plus proactive compaction at logical task boundaries rather than waiting for automatic triggers.

**The agent uses the wrong tool.** Root cause: no explicit tool preference hierarchy. The agent would use `ssh pve1 kubectl` instead of local `kubectl`, or call the `op` CLI instead of the MCP `op_get_secret` tool. Fix: an explicit preference table in `CLAUDE.md` with "Instead of X, use Y" rows.

**The agent hallucinates infrastructure state.** Root cause: stale information from a previous session persisted in memory without a freshness marker. Fix: memory entries now include dates, and the session startup protocol queries current state rather than relying solely on cached context.

## Context Engineering Is Infrastructure

It's tempting to treat context engineering as a writing exercise: just make the prompt better. It's not. It's infrastructure work, closer to designing a database schema or a network topology than to writing documentation. The rules file has failure modes, performance characteristics, and scaling limits. It needs to be tested (does the agent actually follow this instruction?), maintained (are these constraints still accurate?), and monitored (which instructions are being ignored?).

The payoff is proportional to the investment. A well-engineered context turns an AI agent from a tool that occasionally helps into a reliable system that operates on production infrastructure with predictable behaviour. Hundreds of sessions and hundreds of commits in my homelab weren't produced by a better model or a better prompt. They were produced by better information architecture: the right context, in the right place, at the right time.

If you're using AI agents for anything beyond one-off questions, context engineering is the skill that determines whether those agents are useful or just expensive. It's not glamorous work. It's the kind of work that makes everything else possible.
