---
title: 'Homelab Infrastructure'
description: '90+ services on a two-node k3s cluster, operated by one person with seven-layer monitoring.'
tags: ['Infrastructure', 'Kubernetes', 'k3s', 'Self-hosted']
types: ['personal']
order: 5
---

## The platform everything runs on

The homelab is the substrate for all the other projects. Every legal AI tool, every agent session, every deployment runs here. It started as "run a few self-hosted services" and became a production infrastructure platform with serious operational patterns.

## Architecture

Two-node k3s cluster with zero-NodePort architecture: every service gets a stable VIP via MetalLB L2 load balancing rather than relying on node port assignments that change when pods move. Stable service addresses are the single most important reliability improvement for a small cluster — they're the difference between runbooks that work and runbooks that need updating after every node restart.

90+ services across the cluster, spanning every project listed on this site plus the operational infrastructure that keeps it all running: CI/CD, container registry, secret management, DNS, monitoring.

## Seven-layer monitoring

The monitoring architecture is seven independent layers, each with exclusive scope. The design rule was strict: no tool probes the same endpoint as another tool. Overlapping probes fire duplicate alerts and dilute signal. Each layer owns its domain:

- Infrastructure connectivity (Blackbox Exporter)
- Service-layer HTTP health (Uptime Kuma)
- Network devices and SNMP (LibreNMS)
- Workload metrics (Prometheus/Grafana)
- Per-node real-time anomaly detection (Netdata)
- SIEM and host intrusion detection (Wazuh)
- Container runtime security (Falco)

Early on there were two tools probing the same endpoints and firing duplicate alerts. The fix wasn't better deduplication — it was drawing hard boundaries. That single design decision cut alert noise by roughly half.

## Auto-remediation

The auto-remediation pipeline deliberately refuses to restart OOMKilled pods. An OOMKilled pod needs a memory limit change, not a restart. Restarting it is papering over a real problem and will generate the same alert two minutes later. The pipeline fixes what it can fix confidently, escalates after two failed attempts, and gets out of the way for everything else.

## Why it's worth documenting

One person operating 90+ production services with seven-layer monitoring and automated remediation is the concrete answer to "what can AI-augmented operations actually do?" This isn't a demo. It's the platform that runs everything on this site.
