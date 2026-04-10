---
title: 'Homelab Infrastructure'
description: '100+ services on a two-node k3s cluster. Seven-layer monitoring. Zero-NodePort architecture.'
tags: ['Infrastructure', 'Kubernetes', 'k3s', 'Self-hosted']
types: [social]
order: 5
---

## The platform

The homelab is the substrate for all the other projects. Every legal AI tool, every agent session, every deployment runs here.

## Architecture

Two-node k3s cluster with zero-NodePort architecture: every service gets a stable VIP via MetalLB L2 load balancing. Stable service addresses are the difference between runbooks that work and runbooks that need updating after every node restart.

100+ services across the cluster: CI/CD, container registry, secret management, DNS, monitoring, and all the projects listed on this site.

## Seven-layer monitoring

Seven independent layers, each with exclusive scope. No tool probes the same endpoint as another tool. Overlapping probes fire duplicate alerts and dilute signal.

| Layer                       | Tool                 | Scope                                  |
| --------------------------- | -------------------- | -------------------------------------- |
| Infrastructure connectivity | Blackbox Exporter    | VIP reachability, TLS cert validity    |
| Service layer               | Uptime Kuma          | HTTP checks via external DNS           |
| Network devices             | LibreNMS             | SNMP, LLDP, OPNsense, switches         |
| Workload metrics            | Prometheus + Grafana | Pod CPU/memory, custom app metrics     |
| Node metrics                | Netdata              | Per-node real-time system metrics      |
| Host security               | Wazuh SIEM           | Host intrusion detection, log analysis |
| Runtime security            | Falco                | Container escape detection, k8s audit  |

## Auto-remediation

The auto-remediation pipeline deliberately refuses to restart OOMKilled pods. An OOMKilled pod needs a memory limit change, not a restart. Restarting it is papering over a real problem.

The pipeline fixes what it can fix confidently, escalates after two failed attempts, and gets out of the way for everything else.

## Why it's worth documenting

One person operating 100+ production services with seven-layer monitoring and automated remediation is the concrete answer to "what can AI-augmented operations actually do?"

This isn't a demo. It's the platform that runs everything on this site.
