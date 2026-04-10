---
title: 'IRAC Is Just Structured Incident Response'
description: Legal reasoning and incident response follow the same pattern. The crossover surprised me. What doesn't transfer is more interesting.
pubDate: 2026-04-09
tags: [law-school, legal-reasoning, incident-response, career]
featured: false
draft: false
---

Early in my law degree, a tutor explained IRAC: Issue, Rule, Application, Conclusion. It's the structure law students learn for answering problem questions. Identify the legal issue. Find the relevant rule. Apply it to the facts. Reach a conclusion.

I recognised the pattern immediately. It's structured incident response.

When a network goes down, you don't start by rebooting everything. You isolate the fault domain. You form a hypothesis. You test it. You either confirm or eliminate, and then you move to the next candidate. IRAC is the same cognitive process with case citations instead of log files.

The crossover kept surprising me through my first semester.

**Protocol thinking.** Legal procedure is a protocol. There are handshakes (filing and service), state machines (pleadings progress through defined stages), timeouts (limitation periods), error handling (appeals), and strict format requirements. The Victorian Supreme Court's Practice Note SC Gen 1 reads like a wire protocol specification. Margin widths. Font sizes. Line spacing. It's an RFC for legal documents.

**Documentation discipline.** Network engineers document everything. Not because they enjoy it, but because the version of you that configured the router at 2 AM isn't the version of you that will troubleshoot it six months later. Good lawyers operate the same way. Every piece of advice is recorded. Every conversation with a client is noted. Every step in a matter is documented with the same obsessive completeness that a change management process demands. The first time I saw a well-maintained matter file, I recognised it. It was a runbook.

**Adversarial thinking.** I spent years in security engineering. Security architecture is fundamentally about threat modelling: what could an attacker do, what's the attack surface, where are the vulnerabilities. Litigation is adversarial by design. You construct your argument while simultaneously trying to anticipate and dismantle the opposing argument. Cross-examination is penetration testing for witness statements.

But here's where the transfer stops.

**Deterministic outputs.** In networking, if you configure a route correctly, the packet goes where you told it to go. Every time. The system doesn't have opinions. Law is interpretation, not execution. Two judges can read the same statute, consider the same facts, apply the same legal test, and reach opposite conclusions. Both can be "right" within the framework. This is deeply uncomfortable for someone trained to expect deterministic outputs.

**Version control.** When I deploy a broken configuration, I can roll it back. When a court hands down a judgment, that's the state of the law until a higher court says otherwise. There's no revert. There's no staging environment where you can test whether a novel legal argument will succeed before committing it to production. Barristers go live every time.

**Precedent hierarchies.** In infrastructure, a decision tree is something you build. In law, it's something you inherit, and the tree has branches that were decided centuries ago and are still good law today. There's no `git log` for the common law. You learn to read the citations the way a network engineer reads a BGP table: the path tells you the authority.

I'm studying law at Swinburne. The combination of 25 years in infrastructure and legal training is genuinely rare in Australia. There are barristers who understand technology well. There are technologists who understand law well. There are very few people who've spent decades building and securing networks, can read a packet capture or explain a cryptographic protocol to a jury, and are also qualified to appear as counsel.

That overlap is where I'm positioning: law tech, AI in legal practice, the intersection of infrastructure and legal systems. Whether that means the Bar, product, or something else entirely is something I'm working out. The law degree isn't the end goal. It's a capability layer on top of the infrastructure background.

The systems thinking transfers. The protocol thinking transfers. The documentation discipline transfers. What doesn't transfer is the comfort of deterministic outputs, and that's the interesting part: learning to operate in a system where interpretation is the feature, not the bug.

#humanpost
