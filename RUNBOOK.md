# russellbrenner.com — Build & Deployment Runbook

## Overview

Professional portfolio and technical blog built with Astro 5, Svelte 5, and Tailwind 4. Hosted on Cloudflare Pages with automated CI/CD via GitHub Actions.

**Production:** https://russellbrenner.com  
**Source:** https://github.com/russellbrenner/russellbrenner.com

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   GitHub Repo   │ ──▶ │  GitHub Actions  │ ──▶ │  Cloudflare     │
│   (main branch) │     │  (CI/CD)         │     │  Pages          │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │  Cloudflare DNS │
                                              │  *.russellbrenner.com
                                              └─────────────────┘
```

**Build:** Astro static site generation (SSG)  
**Deploy:** `wrangler pages deploy` via GitHub Actions  
**DNS:** CNAME `russellbrenner.com` → `russellbrenner-com.pages.dev` (proxied)

---

## Quick Start

### Prerequisites

| Tool     | Version    | Install                                 |
| -------- | ---------- | --------------------------------------- |
| Node     | 22.x (LTS) | `mise install` or `nvm install`         |
| pnpm     | latest     | `corepack enable`                       |
| wrangler | 4.x        | `pnpm add -g wrangler` (local dev only) |

### Local Development

```bash
# Clone and install
git clone https://github.com/russellbrenner/russellbrenner.com.git
cd russellbrenner.com
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

---

## Deployment Process

### Automatic Deployment (Recommended)

Every push to `main` triggers automatic deployment:

1. Push commit to `main`
2. GitHub Actions runs: lint, type-check, security scan, build
3. On success, deploys to Cloudflare Pages production
4. Cloudflare propagates globally (~30 seconds)

**Check deployment status:**

```bash
# View recent runs
gh run list --limit 5

# View specific run
gh run view <run-id>

# Watch live
gh run watch
```

### Manual Deployment

```bash
# Build
pnpm build

# Deploy (requires Cloudflare credentials)
export CLOUDFLARE_API_TOKEN="your-token"
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
wrangler pages deploy dist --project-name russellbrenner-com --branch main
```

---

## Content Workflow

### Adding a Blog Post

1. **Create file** in `site/content/posts/`:

```markdown
---
title: 'Your Post Title'
description: 'SEO description (150-160 chars)'
pubDate: 2026-04-10
tags: [tag1, tag2, tag3]
featured: false
draft: true # Keep true until ready
---

Your content here...
```

2. **Build locally** to verify:

```bash
pnpm build
```

3. **Commit and push:**

```bash
git add -A
git commit -m "feat: add new post draft"
git push origin main
```

4. **Publish:** Change `draft: false` and push again.

### Draft Posts

Posts with `draft: true`:

- Do NOT appear in the built site
- Do NOT appear in RSS/sitemap
- ARE visible as raw markdown on GitHub (intentional for version control)

### Adding a Project

1. **Create file** in `site/content/projects/`:

```markdown
---
title: 'Project Name'
description: 'One-line description'
link: 'https://project-url.com' # Optional
github: 'https://github.com/...' # Optional
tags: [astro, typescript]
types: [open-source] # commercial, open-source, social
order: 1 # Higher = featured first
directLink: false # If true, requires valid link
---

Project details (markdown)...
```

2. **Build and verify:**

```bash
pnpm build
```

3. **Push to deploy.**

---

## Security Pipeline

### Pre-Commit Hooks (Lefthook)

Runs locally before every commit:

| Hook         | Purpose                   |
| ------------ | ------------------------- |
| `lint`       | ESLint on changed files   |
| `format`     | Prettier format check     |
| `type-check` | Astro + Svelte type check |

### GitHub Actions CI

Runs on every push/PR:

| Job          | Purpose                                      |
| ------------ | -------------------------------------------- |
| `lint`       | ESLint full repo                             |
| `format`     | Prettier check                               |
| `type-check` | Astro + Svelte                               |
| `security`   | TruffleHog, Gitleaks, Semgrep, Trivy, CodeQL |
| `build`      | Astro build                                  |
| `deploy`     | Cloudflare Pages upload                      |

### Weekly Security Scan

Every Monday at 03:17 UTC:

- Full TruffleHog scan (entire git history)
- Deep Gitleaks scan with verification
- Trivy SCA with SARIF upload

### Viewing Security Results

1. **Security Tab:** GitHub → Security for all findings
2. **Actions Tab:** GitHub → Actions → Security Scan for run logs
3. **PR Checks:** Security status appears in pull request checks

---

## Troubleshooting

### Build Fails

```bash
# Check error output
pnpm build 2>&1 | tail -50

# Common causes:
# - Missing frontmatter fields
# - Invalid Markdown syntax
# - TypeScript errors in src/
```

### Deployment Fails

```bash
# Check Cloudflare status
wrangler pages deployment list --project-name russellbrenner-com

# Check API token
wrangler whoami

# Re-deploy manually
wrangler pages deploy dist --project-name russellbrenner-com --branch main
```

### Security Scan Fails

1. **Secret detected:** Rotate immediately, remove from history
2. **Vulnerability found:** Update dependency or patch code
3. **False positive:** Add inline suppression comment

```javascript
// codeql[js/some-rule] OK: Reason for exception
```

### Content Not Appearing

1. Check `draft: true` in frontmatter
2. Verify file is in correct directory (`site/content/`)
3. Rebuild locally: `pnpm build`
4. Check Cloudflare cache: hard refresh (Cmd+Shift+R)

---

## Metrics & Monitoring

### Build Metrics

```bash
# Check build time
pnpm build 2>&1 | grep "Complete"

# Check page count
find dist -name "*.html" | wc -l
```

### Performance

- **First Contentful Paint:** Check Chrome DevTools Lighthouse
- **Lighthouse Score:** `pnpm preview` then audit
- **Core Web Vitals:** Google Search Console

### Uptime

- **Cloudflare Status:** https://www.cloudflarestatus.com/
- **Manual check:** `curl -sI https://russellbrenner.com | head -3`

---

## Access & Permissions

### GitHub Repository

| Role  | Permissions                       |
| ----- | --------------------------------- |
| Admin | Full access, settings, deployment |
| Write | Push, create PRs, manage issues   |
| Read  | View, clone, comment              |

### Cloudflare Pages

Access via Cloudflare dashboard:

1. Login to Cloudflare
2. Pages → russellbrenner-com
3. Settings → Access controls

### Secrets Management

| Secret                | Storage        | Usage                  |
| --------------------- | -------------- | ---------------------- |
| Cloudflare API Token  | GitHub Secrets | CI/CD deployment       |
| Cloudflare Account ID | GitHub Secrets | Project identification |
| Analytics Token       | Vault          | Google Analytics       |

---

## Version History

| Version | Date    | Changes                              |
| ------- | ------- | ------------------------------------ |
| 2.0     | 2026-03 | Astro 5 migration, security pipeline |
| 1.0     | 2026-02 | Initial Cloudflare Pages deployment  |

---

## Contact

- **Owner:** @russellbrenner
- **Issues:** GitHub Issues tab
- **Security:** See SECURITY.md
