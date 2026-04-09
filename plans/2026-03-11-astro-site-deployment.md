# Plan: Astro/Spaceship Site — Content Completion + k8s Deployment

**Date:** 2026-03-11
**Repo:** `~/git/russellbrenner.com`
**Target:** `russellbrenner.itsa.house` (internal test) → `russellbrenner.com` (production)

## Context

The MkDocs russellbrenner.com site is being replaced with an Astro/Spaceship site.
The Spaceship theme fork is at `github.com/russellbrenner/russellbrenner.com`.
Gitea is primary origin; GitHub is mirror for Cloudflare Workers production deploy.

k8s manifests already exist in `homelab/k8s/russellbrenner/`.
The namespace is `russellbrenner`, deployment name is `russellbrenner`,
image is `git.itsa.house/rbrenner/russellbrenner:latest`.

## Decisions

- Gitea Actions builds the site and pushes image on every push to main
- Multi-stage Dockerfile: pnpm build in node:22-alpine, serve via nginx:alpine
- k8s ingress: `russellbrenner.itsa.house` for internal testing; production DNS TBD
- Blog posts adapted verbatim from MkDocs originals; only frontmatter and internal links changed
- No demo/placeholder content on the public site
- `russellbrenner.com` Cloudflare Workers deploy from GitHub mirror (separate task)

## Content Inventory

### Written (previous session)
- `site/config.ts` — full rewrite with Russell's details
- `site/hero.md` — positioning statement
- `site/cta.md` — contact CTA
- `site/content/about/index.md` — career arc + projects + AI-honest positioning
- `site/content/projects/auslaw-mcp.md` — live open-source
- `site/content/projects/silk.md` — in development
- `site/content/projects/family-law-platform.md` — in development
- `site/content/projects/agent-orchestration.md` — multi-agent platform
- `site/content/projects/homelab.md` — homelab infrastructure

### To Write (this session)
- `site/content/posts/not-a-software-engineer.md`
- `site/content/posts/network-engineer-law-school.md`
- `site/content/posts/context-engineering.md`

### To Delete
- All Spaceship demo posts, projects, appearances

## Steps

1. Write 3 blog posts in Spaceship frontmatter format
2. Delete all Spaceship demo content
3. Write Dockerfile + nginx.conf
4. Write .gitea/workflows/build.yml (buildah build + push + rollout)
5. Update homelab k8s ingress to `russellbrenner.itsa.house`
6. Commit everything to Gitea origin
7. Push homelab k8s changes (auto-deploy workflow handles kubectl apply)
8. Verify rollout and site at russellbrenner.itsa.house

## Constraints

- No `*.itsa.house` hostnames in content
- No `brenner-v-knorr` or case names
- No `MatterMesh`, no `untangle`
- No em dashes
- Australian English throughout
