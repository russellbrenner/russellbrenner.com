---
title: What Happens When a Network Engineer Goes to Law School
description: The surprising overlaps between 25 years of infrastructure work and a law degree, plus what doesn't transfer at all.
pubDate: 2026-03-05
tags: [law-school, legal-tech, career, victorian-bar]
featured: true
---

I'm studying for an LLB at Swinburne University of Technology. My classmates are mostly in their twenties. I'm a 40-something network engineer with a CCNP who spent the last 25 years in pre-sales, and I'm the one asking questions about packet captures during evidence law tutorials.

It's not as strange a fit as it sounds. Or maybe it is, and I've just stopped noticing.

The decision to study law wasn't a crisis. Nobody sat me down and told me networking was dying. Nobody needed to. I looked at the legal profession from the outside and saw a gap that was, to borrow the engineering term, non-trivial. Courts are increasingly dealing with digital evidence, cybersecurity incidents, AI-generated content, and complex technical systems. The lawyers handling these matters are smart, but most of them are working from analogy rather than experience. They understand that a firewall exists. They don't understand why a stateful inspection engine would log a SYN packet but not the subsequent ACK, or what that absence means for the evidentiary timeline.

The Victorian Bar needs technically literate barristers. That's not a prediction; it's an observation based on looking at the matters being briefed and the expertise available to handle them. As AI systems make decisions that affect people's rights, as cybersecurity breaches trigger mandatory disclosure obligations, as digital forensics becomes central to both criminal and civil litigation, the gap between lawyers who understand technology and technologists who understand law is becoming a genuine market opportunity. I intend to sit in that gap.

## What transfers

The surprise of law school hasn't been how different it is from engineering. It's been how much of the underlying reasoning is the same.

**Structured problem decomposition.** When a network goes down, you don't start by rebooting everything. You isolate the fault domain. You form a hypothesis. You test it. You either confirm or eliminate, and then you move to the next candidate. Legal problem analysis follows exactly the same structure. You identify the legal issue, you find the relevant rule, you apply it to the facts, and you reach a conclusion. IRAC (Issue, Rule, Application, Conclusion) is just a troubleshooting methodology with a law school acronym. The first time a tutor explained it, I thought: this is just a structured incident response with case citations instead of log files.

**Protocol thinking.** Legal procedure is a protocol. There are handshakes (filing and service), state machines (pleadings progress through defined stages), timeouts (limitation periods), error handling (appeals), and strict format requirements (court rules that specify margin widths and font sizes with the same rigidity as an RFC). The Victorian Supreme Court's Practice Note SC Gen 1 reads like a wire protocol specification. Once you see it that way, procedural law stops being intimidating and starts being familiar. You've seen this pattern before. The syntax is different; the logic isn't.

**Documentation discipline.** Network engineers document everything. Not because they enjoy it, but because the version of you that configured the router at 2 AM isn't the version of you that will troubleshoot it six months later, and future-you deserves to know what past-you was thinking. Good lawyers operate the same way. Every piece of advice is recorded. Every conversation with a client is noted. Every step in a matter is documented with the same obsessive completeness that a change management process demands. The first time I saw a well-maintained matter file, I recognised it immediately. It was a runbook.

**Adversarial thinking.** I spent years in security engineering. Security architecture is fundamentally about threat modelling: what could an attacker do, what's the attack surface, where are the vulnerabilities, what controls mitigate the risk. Litigation is adversarial by design. You construct your argument while simultaneously trying to anticipate and dismantle the opposing argument. Cross-examination is penetration testing for witness statements. I don't mean that as a loose metaphor. The cognitive process is genuinely the same: identify the weaknesses, test them under pressure, and build your case around what survives.

## What doesn't transfer

If the transfers made me comfortable, the gaps made me humble. Some engineering instincts are actively counterproductive in law.

**The assumption that systems behave predictably.** In networking, if you configure a route correctly, the packet goes where you told it to go. Every time. The system doesn't have opinions. Law is interpretation, not execution. Two judges can read the same statute, consider the same facts, apply the same legal test, and reach opposite conclusions. Both can be "right" within the framework. This is deeply uncomfortable for someone trained to expect deterministic outputs. The first time I read a dissenting judgment that I found more persuasive than the majority, I had a genuine moment of cognitive dissonance. The system produced an output, and I disagreed with it, and that disagreement was legitimate rather than a configuration error.

**The expectation of deterministic outputs.** Related but distinct. In engineering, if you follow the same process with the same inputs, you get the same result. In law, the result depends on the judge, the jurisdiction, the era, the broader social context, and (occasionally, uncomfortably) factors that have nothing to do with the legal merits. Legal reasoning is rigorous, but it isn't reproducible in the engineering sense. Precedent provides constraints, not guarantees. A case decided in 1932 can still be good law in 2026, or it can have been quietly distinguished into irrelevance over decades without anyone formally overruling it. There's no `git log` for the common law.

**The comfort of version control.** When I deploy a broken configuration, I can roll it back. When a court hands down a judgment, that's the state of the law until a higher court says otherwise. There's no revert. There's no staging environment where you can test whether a novel legal argument will succeed before committing it to production. Barristers go live every time. The closest equivalent to a pull request review is a moot, and even that's a simulation, not a dry run.

## Building the tools I needed

The infrastructure instinct didn't switch off when I enrolled. It redirected.

Within the first semester, I found myself frustrated by legal research tools. The databases work, but they're built around keyword search. If you know the citation, you can find the case. If you know the exact phrase a court used, you can search for it. But if you're trying to answer a conceptual question ("when does a duty of care arise for pure economic loss"), keyword search forces you to already know the answer well enough to formulate the right query. That's backwards.

So I built a retrieval system that understands legal language natively. A RAG API using voyage-law-2 embeddings (trained on legal corpora, not general text) with citation-aware chunking that preserves the structure of judgments and legislation. It runs on k3s. The system knows that _Perre v Apand Pty Ltd_ is a leading authority on pure economic loss not because someone tagged it, but because the embedding model learned the structural signals that mark a case as authoritative.

This is what happens when a network engineer encounters a problem: they build infrastructure. I could have just read more cases. Instead, I built a semantic search engine, integrated it into my AI agent platform via MCP tools, and now my Claude sessions can search Australian case law as part of a research conversation. An engineer's answer to a law student's problem.

I'm aware of the irony. I'm also aware that it works.

### Celebrate: the study platform

The legal search engine was the first tool. The second was more personal.

Canvas LMS is the university's learning management system. It stores materials, tracks submissions, shows grades. It does the institutional job. But Canvas's student-facing interface assumes a particular kind of brain: one that handles long lists without shutting down, one that responds to urgency rather than being paralysed by it. I've got ADHD, and a dashboard showing "12 overdue items" with red badges isn't motivation. It's a wall.

So I built celebrate ("delegate and celebrate"): a study automation platform that treats assignments as workflows, not deadlines. Every assignment moves through a nine-stage pipeline (detected, repo_setup, research, drafting, scheduled, ready, in_progress, review, submitted), and the interface shows you where you are, not what you've missed. "You're in the research phase; here are three things you could do right now" is fundamentally different from "due Friday" in red.

The spaced repetition uses FSRS-5 (the algorithm behind Anki) with 17 weights modelling a retrievability decay curve. When a card's retrievability drops below 90%, it surfaces. No manual scheduling, no arbitrary intervals. Lectures go through a content pipeline: Whisper for transcription, Claude for summarisation, ElevenLabs for text-to-speech, so I can review material while walking the dog.

The design rule that drives everything: maximum three visible items at any time. No guilt language. No overdue badges. Progressive disclosure (submission instructions don't appear during the research phase). Gamification that tracks progress without exploiting loss aversion. The Mattermost bot is the primary interface, because opening another browser tab is a context switch, and every context switch is a risk that ADHD turns into "I opened Chrome and now I'm reading about the history of pencils."

celebrate is TypeScript/Bun, Hono, PostgreSQL, Redis, running on k3s. It's the most personally useful thing I've built. The legal RAG API makes me a better researcher. celebrate makes me a functioning student.

## The Victorian Bar

Targeting the Bar as a mature-age student is a specific bet. The path is well-defined: complete the LLB, satisfy the practical legal training requirements, apply for admission to practice, then complete the Bar Readers' Course. The reading period is nine months of intensive training under the supervision of a senior barrister (your "reader's master"), during which you learn the practical skills that law school doesn't teach. How to draft pleadings. How to appear in court. How to run a practice as a sole trader, because that's what every barrister is.

The combination of deep technical expertise and a legal qualification is genuinely rare in Australia. There are barristers who understand technology well. There are technologists who understand law well. There are very few people who've spent 25 years building and securing networks, hold current security certifications, can read a packet capture or explain a cryptographic protocol to a jury, and are also qualified to appear as counsel. That scarcity is the opportunity.

The areas where this combination has the most value are growing, not shrinking. Privacy litigation, cybersecurity breach class actions, disputes involving AI systems, digital forensic evidence, telecommunications regulatory matters, intellectual property in software. These aren't niche practice areas any more. They're increasingly central to commercial litigation, and they require counsel who can engage with the technical detail rather than outsourcing it entirely to expert witnesses.

I'm not suggesting that expert witnesses become unnecessary. I'm saying that a barrister who can read the expert's report, understand it without a tutorial, identify the gaps or assumptions, and cross-examine the opposing expert on the actual technical merits brings something that a barrister relying on a crash course can't match.

## The honest assessment

Law school at 40-something is harder in some ways and easier in others. The difficulty is time. I've got a family, a homelab running 88 services that demands attention (services don't stop failing because you have a constitutional law exam), and a study platform that I keep building instead of using. The readings are measured in hundreds of pages per week, and legal writing requires a precision that technical writing doesn't prepare you for. "Close enough" isn't a concept that survives contact with a law school rubric.

The advantage is perspective. I've spent decades watching organisations make decisions, manage risk, negotiate contracts, and deal with the consequences when things go wrong. When a torts lecture discusses foreseeability, I'm not working from hypotheticals. I've seen the incident reports. When a contracts lecture explains the doctrine of frustration, I think about force majeure clauses I've actually read in vendor agreements. The law isn't abstract when you've got 25 years of context for how it applies in practice.

The other advantage is that I know how to learn efficiently. Not because I'm smarter than my classmates (I'm not), but because I've had to learn new technical domains repeatedly throughout my career. Going from Cisco IOS to Junos to Check Point to Fastly's VCL isn't the same as going from networking to law, but the meta-skill of rapidly acquiring domain knowledge in a structured way is transferable. And now I've got a study platform that was literally built around how my brain works.

## The point

The law needs people who understand systems. Not just legal systems, but the technical systems that increasingly define how evidence is created, stored, transmitted, and destroyed. How contracts are executed by software. How personal data flows across jurisdictions. How an AI model makes a decision that affects someone's insurance premium or parole application.

I'm not switching careers. I'm adding a capability. The networking and security background isn't something I'm leaving behind. It's the foundation that makes the legal qualification valuable. The Victorian Bar doesn't need another generalist. It needs barristers who can stand up in court and explain, with technical authority and legal precision, what actually happened inside the system.

That's the bet. Ask me in five years whether it paid off.
