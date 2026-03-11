---
title: "I'm Not a Software Engineer. I Built a Production AI Agent Platform Anyway."
description: How 25 years of networking and solutions architecture transferred directly into building and operating a multi-agent AI platform — and what that means for infrastructure people who want to build.
pubDate: 2026-03-05
tags: [ai-infrastructure, career, claude-code, agent-orchestration]
featured: true
---

I've never held a software engineering title. Not once in 25 years. My career is networking, pre-sales, solutions architecture, and customer success. I started at an ISP in Melbourne in 2000, worked my way into carrier ethernet engineering, spent a decade selling and designing enterprise network and security solutions, and ended up as a Technical Account Manager at an edge computing company. At every stop, I was the person who understood the technology deeply enough to design solutions and explain them to customers. I was never the person who wrote the production code.

Today I'm running 88 Kubernetes deployments across 47 namespaces on a two-node cluster. I've built a multi-agent orchestration platform with 42 custom skills and real-time LLM supervision, a legal semantic search engine, and a study automation platform that syncs my university's LMS and schedules spaced repetition. All in production. All AI-assisted.

This is the story of how that happened, what it actually means, and why the line between "builder" and "operator" is thinner than anyone expected.

## Twenty-five years of not writing code

Let me be specific about the career, because the details matter.

My career started in Melbourne in 2000 at a small ISP. Linux systems administration, routing protocols, network operations at residential scale. The foundational years, learning how infrastructure works by operating it.

**iiNet** (Greater Melbourne Area) was the next step: deeper network engineering, larger scale, more complex problems.

**Uecomm** (later acquired by PIPE Networks) was carrier ethernet. Metro fibre deployments across Australian cities. This was the first time I worked on infrastructure where a misconfiguration didn't just break someone's internet; it broke a hospital's connectivity or a bank's trading floor uplink. The operational discipline that comes from carrier-grade work never left me.

**O2 Networks** (now Telstra-owned) was network and security professional services consulting. A lean team doing high-complexity work for enterprise and carrier clients. When you work in professional services, every engagement is a different set of constraints, a different failure mode, a different answer to "what does good look like here." That variety teaches infrastructure judgment faster than almost anything else.

Then I moved into pre-sales and solutions architecture. **NTT** (through the Dimension Data acquisition) was enterprise networking for large accounts. **Brocade** put me at the front of the SDN and NFV wave, selling software-defined networking to service providers during the transition away from proprietary hardware. **Check Point** was security engineering: threat prevention architecture across network, cloud, and endpoint environments.

**Fastly** was the last stop before the current work. Six months as Senior Security Technical Account Manager for ANZ, working at the intersection of edge computing, CDN performance, and application security. Fastly's where I first saw how much a small team could accomplish with the right platform underneath them. A handful of engineers operating a global network that handles trillions of requests. That insight drives everything I've built since.

Throughout all of this, I could script bash, write basic Python, hack together automation. I could read code well enough to design around it. But "software engineer" was never my title, never my identity, and never my aspiration. I was an infrastructure person who happened to understand how software worked.

## What changed

Claude Code changed.

Not in the abstract, "AI will transform everything" sense that LinkedIn is saturated with. In the concrete, specific sense that I went from "I can automate some tasks with bash and Python" to "I'm building and operating a production platform with TypeScript, React, FastAPI, Redis, and PostgreSQL" in a matter of months.

This isn't a weekend project with a Helm chart and a blog post. It's sustained, systematic work across hundreds of sessions, each one involving architecture decisions, code review, debugging, deployment, and operational follow-through.

What made it click wasn't the code generation itself. Copilot and ChatGPT can generate code. What made it click was the conversational, iterative development model. I could describe a system the way I'd describe it to a junior engineer on my team: "Here's the problem. Here's the architecture I want. Here are the constraints. Here's what I've tried that didn't work." And then I could review the output, push back on decisions I disagreed with, ask for alternatives, and iterate until the implementation matched the design in my head.

That workflow maps perfectly onto how solutions architects already work. We design systems. We define constraints. We evaluate tradeoffs. We communicate intent to implementers. The only difference is that the implementer is an AI model running in a terminal instead of a person sitting in the next cubicle.

## What I actually built

Five projects tell the story. Each one would be a multi-person engineering effort using traditional development. Each one was built by me, with Claude Code, operating as both architect and (AI-augmented) implementer.

### Agent orchestration platform

The problem I wanted to solve: I had AI agents running on three different machines, and no way to supervise them without checking each terminal manually. So I built a platform that treats agent sessions as first-class workloads with real-time oversight.

The supervision layer is the part I'm most proud of. Every session's output streams through an LLM classifier that catches failure patterns simple heuristics miss. An agent stuck in a retry loop looks active by process metrics, but the supervisor recognises the repetition and escalates. I get a Mattermost notification only when something actually needs attention. That single feature changed the operational model from "check on agents every 20 minutes" to "get told when something's wrong."

Beyond supervision, the platform encodes institutional knowledge as 42 custom skills: reusable agent workflows for deployment, debugging, plan execution, code review, memory management, and a dozen other operational procedures. Each skill is a version-controlled, testable specification that agents consume at session start. It's context engineering as infrastructure, and it's the discipline that makes agents reliable instead of impressive.

The React observability dashboard ties it together: session state, task progress, hook-based event ingestion, and real-time agent health. The surprise was how much the feedback loop mattered. The platform was built by agents running on the platform. Every deployment bug was immediately felt, because the sessions fixing the code were running on the infrastructure the code managed.

### Homelab infrastructure platform

This started as "run a few self-hosted services" and became 88 deployments on k3s with proper infrastructure patterns: stable VIPs for every service, seven-layer monitoring with non-overlapping scopes, automated remediation with escalation gates.

The monitoring architecture deserves its own paragraph. Seven independent layers, each with exclusive scope: Blackbox Exporter for infrastructure connectivity, Uptime Kuma for service-layer HTTP checks, LibreNMS for SNMP and network devices, Prometheus/Grafana for workload metrics, Netdata for per-node real-time anomaly detection, Wazuh for SIEM and host intrusion detection, and Falco for runtime security monitoring of container behaviour. Early on, I had two tools probing the same endpoints and firing duplicate alerts. The fix wasn't better deduplication; it was drawing hard boundaries. Each layer owns its domain exclusively. That single design decision cut alert noise by roughly half.

The auto-remediation pipeline taught a similar lesson about restraint. It deliberately refuses to restart OOMKilled pods (they need a memory limit change, not a restart) and escalates to a human after two failed attempts. Fix what you can confidently fix; get out of the way for everything else. 684 infrastructure commits in 2026 alone, because every change is a commit.

### Celebrate (study automation)

I'm a neurodivergent law student, and traditional LMS interfaces are hostile to ADHD. Canvas puts everything in a flat list with red overdue badges and a notification count that climbs every time you look at it. That's not a dashboard; it's a guilt delivery system.

So I built celebrate ("delegate and celebrate"): a study automation platform that syncs with Canvas LMS, tracks assignments through a proper state machine (detected, repo_setup, research, drafting, scheduled, ready, in_progress, review, submitted), schedules spaced repetition using FSRS-5, transcribes lectures via Whisper, summarises them with Claude, and generates study audio via ElevenLabs TTS. The Mattermost bot is the primary interface, because meeting the student where they already are beats forcing them into another tab.

The design philosophy: maximum three visible items at any time. No overdue badges. No guilt language. Progressive disclosure: finish one, the next appears. Gamification without manipulation (XP, streaks, mastery tracking, but no loss aversion or social comparison).

The state machine insight was the most valuable: treating assignments as workflows with defined transitions reduces cognitive load dramatically. It's not "this is due Friday." It's "you're in the research phase; here are the three things you could do right now."

TypeScript/Bun, Hono, PostgreSQL, Redis. Source code coming soon.

### Legal knowledge platform

I'm doing a law degree at Swinburne, and general-purpose search tools handle legal text poorly. The difference between "applied" and "distinguished" in a judicial citation determines whether a case supports your argument or destroys it. General embedding models treat these as near-synonyms.

So I built a RAG API with voyage-law-2 domain-specific embeddings and citation-aware chunking. 1024-dimension vectors in PostgreSQL/pgvector, query latency under 300ms. The detail that made the difference: ingesting a case takes one click (the AustLII URL encodes court and jurisdiction in its path) instead of filling out a form. That's the gap between a system that gets used and one that collects dust.

### Custom MCP server

50+ tools spanning secrets management, source control, project management, document search, and infrastructure queries. This is the connective tissue between AI agent sessions and production infrastructure. When an agent needs to create a work item, look up a secret, or search case law, it calls an MCP tool with proper authentication and audit logging. Without this, every agent session would be isolated from the systems it's meant to operate on.

## The honest frame

Here's where most "I built X with AI" posts either flinch or exaggerate. Let me be direct.

Claude Code writes the majority of the code in this homelab. I'm transparent about that because it matters. Claiming otherwise would be dishonest, and claiming the code is the hard part would be wrong.

What Claude Code does well: implement functions to a specification, follow established patterns, translate architecture intent into working code, fix bugs when given clear reproduction steps, and iterate quickly on feedback. It's remarkably good at these tasks, and it gets better with each model generation.

What Claude Code doesn't do: decide what to build. Choose between Redis and a message queue for session state. Recognise that a zero-NodePort architecture trades MetalLB complexity for simplicity everywhere else. Know that voyage-law-2 embeddings will outperform general models on Australian legal text. Understand that monitoring seven layers deep is necessary but monitoring the same layer twice creates noise. Design a neurodivergent-first interface that limits visible tasks to three. Debug a networking issue at 2 AM when the root cause turns out to be USB NIC MTU limits silently dropping jumbo frames. Make the call that auto-remediation should deliberately refuse to restart OOMKilled pods because they need a memory limit change, not a restart.

The architecture, operations, and judgment are mine. The code is AI-assisted. Both contributions are real and substantial.

## What transferred from 25 years of infrastructure

The thing that surprised me most was how much of my existing skillset transferred directly. Not metaphorically. Directly.

**Systems thinking.** Twenty-five years of designing networks means you think in terms of component interactions, failure modes, and cascading effects. When I designed the monitoring stack, I instinctively separated the seven layers by failure domain because that's what you do with network monitoring: you never want the tool that detects link failures to also be the tool that checks application health, because a single-point failure in the monitoring layer blinds you to both. That instinct didn't come from software engineering. It came from decades of network architecture.

**Operational discipline.** Networks teach you that the deployment isn't the hard part; the 3 AM incident response is the hard part. Every system I've built has monitoring, alerting, runbooks, and escalation paths, not because I read an SRE book (though I have), but because I've been the person on call when something breaks and there's no documentation. The auto-remediation pipeline, with its cooldown gates and escalation to human review after two failures, is a direct translation of how NOC operations work. Fix what you can, escalate what you can't, and never make the same automated mistake twice.

**Architecture taste.** Knowing when something is over-engineered versus under-built is a judgment skill that takes years to develop. It's the difference between "we need a message queue here" and "a Redis key with a TTL does the same thing with fewer moving parts." Solutions architects live in this space. Every customer engagement is an exercise in finding the simplest design that meets the requirements without creating technical debt. That skill transfers perfectly to building your own systems.

**Customer empathy.** Understanding what users actually need versus what they ask for. When I built the legal knowledge platform, the initial design had a rich web UI for search and ingestion. I scrapped it entirely in favour of MCP tools, because the actual user (me, working in Claude Code) would never leave the terminal to open a browser. When I built celebrate, the initial design had a full web dashboard as the primary interface. I deprioritised it in favour of a Mattermost bot, because the actual user (me, a neurodivergent student) would never open another tab voluntarily. Fifteen years of pre-sales, where the gap between what customers request and what they need is your entire job, made those calls obvious.

**Communication.** Explaining technical concepts to non-technical audiences is what solutions architects do every day. Turns out that skill also applies to explaining system design to an AI model. The better I describe the architecture, constraints, and intent, the better the output. Context engineering is just stakeholder communication with a different audience.

## What AI-augmented development actually looks like

"If the AI wrote the code, you didn't really build it."

By that logic, an architect who doesn't lay bricks didn't really build the building. A film director who doesn't operate the camera didn't really make the film. A solutions architect who doesn't write the Terraform didn't really design the infrastructure.

The hundreds of hours aren't passive. Every session requires context engineering (explaining the state of the system, the constraints, what's been tried), reviewing output (catching mistakes, pushing back on poor decisions, redirecting approaches), debugging failures (when the AI's code breaks in production, I'm the one diagnosing it), and making decisions (what to build next, what to defer, what to scrap entirely). The AI accelerates implementation. It doesn't replace understanding.

It's closer to how a principal engineer works with a team of junior developers than it is to pressing a "generate code" button. You still need to know what good looks like. You still need to catch when the output is subtly wrong. You still need to understand the system deeply enough to debug it when it fails in ways the AI didn't anticipate.

The bottleneck shifts. Instead of "I can design this but I can't implement it fast enough," it becomes "I can implement this as fast as I can think through the design." For someone who's spent 25 years designing systems and explaining them to implementers, that shift is transformative.

## The question isn't whether you can code

If you're a network engineer, a solutions architect, a systems administrator, or anyone with deep technical knowledge who's been told you need to "learn to code" to build real things, the barrier just dropped. Not to zero. You still need to understand what you're building, why you're building it, and how to keep it running. But those are skills you already have.

The question isn't whether you can code. It's whether you can think in systems. Whether you can decompose a problem into components, understand how those components interact, anticipate how they fail, and make sound judgment calls under uncertainty. Whether you can take 25 years of hard-won operational intuition and point it at a new toolchain.

If you can do that, the code will follow.
