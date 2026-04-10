# russellbrenner.com — Deployment Runbook

## Overview

Professional portfolio and technical blog. Astro 5 + Svelte 5 + Tailwind 4 static site. Hosted on Cloudflare Pages.

**URLs:**

- Production: https://russellbrenner.com
- Pages preview: https://russellbrenner-com.pages.dev

**Source:** https://github.com/russellbrenner/russellbrenner.com

---

## Architecture

```
GitHub Repo → GitHub Actions (CI) → Cloudflare Pages → Cloudflare DNS → russellbrenner.com
```

**Build:** Astro static site generation (SSG)
**Deploy:** `wrangler pages deploy dist --project-name russellbrenner-com --branch main`
**DNS:** CNAME `russellbrenner.com` → `russellbrenner-com.pages.dev` (proxied via Cloudflare)

---

## Prerequisites

### Vault Secrets

All secrets stored in Vault at `secret/api/cloudflare`:

| Key          | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| `pages-api`  | Cloudflare API token with Pages:Edit and DNS:Edit permissions |
| `account-id` | Cloudflare Account ID                                         |

To retrieve:

```bash
vault_mcp read_secret(mount="secret", path="api/cloudflare")
```

### Local Tooling

| Tool     | Version    | Install                |
| -------- | ---------- | ---------------------- |
| Node     | 24.x (LTS) | `mise install`         |
| pnpm     | latest     | `mise install`         |
| wrangler | 4.x        | `pnpm add -g wrangler` |

---

## Deployment Process

### Initial Setup (One-Time)

1. **Create Cloudflare Pages project:**

   ```bash
   export CLOUDFLARE_API_TOKEN="<from vault>"
   export CLOUDFLARE_ACCOUNT_ID="<from vault>"
   wrangler pages project create russellbrenner-com --production-branch main
   ```

2. **Add custom domain in Cloudflare:**

   ```bash
   curl -X POST \
     "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/russellbrenner-com/domains" \
     -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
     -H "Content-Type: application/json" \
     --data '{"name":"russellbrenner.com"}'
   ```

3. **Add DNS record** (via Cloudflare API or UI):
   - Type: CNAME
   - Name: `russellbrenner.com`
   - Content: `russellbrenner-com.pages.dev`
   - Proxied: true

### Deploy Workflow

```bash
# 1. Pull latest
cd ~/git/russellbrenner.com
git pull origin main

# 2. Install dependencies
mise install
pnpm install --frozen-lockfile

# 3. Build
pnpm build

# 4. Deploy
export CLOUDFLARE_API_TOKEN="<from vault>"
export CLOUDFLARE_ACCOUNT_ID="<from vault>"
wrangler pages deploy dist --project-name russellbrenner-com --branch main
```

### Verify Deployment

```bash
# Check Pages deployment
wrangler pages deployment list --project-name russellbrenner-com | head -5

# Check site renders
curl -sI https://russellbrenner-com.pages.dev | head -3
curl -sI https://russellbrenner.com | head -3

# Check custom domain DNS
dig russellbrenner.com CNAME +short
```

Expected: HTTP/2 200, DNS returns `russellbrenner-com.pages.dev`

---

## Content Workflow

### Adding a New Post

1. Create file in `site/content/posts/`:

   ```markdown
   ---
   title: 'Post Title'
   description: SEO description
   pubDate: 2026-04-09
   tags: [tag1, tag2]
   featured: false
   draft: true # Keep true until ready to publish
   ---
   ```

2. Build locally to verify:

   ```bash
   pnpm build
   ```

3. Commit and push:

   ```bash
   git add -A
   git commit -m "feat: add new post"
   git push origin main
   ```

4. Deploy (CI does this automatically, or manual):

   ```bash
   pnpm build
   wrangler pages deploy dist --project-name russellbrenner-com --branch main
   ```

5. Flip `draft: false` when ready to publish.

### Draft Posts

Posts with `draft: true`:

- Do NOT appear in the built site
- Do NOT appear in RSS feed or sitemap
- ARE visible as raw markdown on GitHub (this is intentional)

---

## Security Pipeline

GitHub Actions workflows in `.github/workflows/`:

### `security.yml`

Runs on every push/PR:

- **Gitleaks:** Secret scanning
- **Trivy SCA:** Software composition analysis (npm vulnerabilities)
- **Sanitisation gate:** Blocks internal hostnames/IPs (`itsa.house`, `10.0.x.x`, `192.168.x.x`)
- **Gate job:** Fails deployment if any check fails

Weekly (Mondays 3:17am UTC):

- **TruffleHog:** Deep secret scanning with verification

### `ci.yml`

Runs on every push:

- Prettier format check
- ESLint
- Astro type check
- Svelte check

Check run status:

```bash
gh run list --limit 5
gh run view <run-id> --log-failed
```

---

## Dependabot

Configured in `.github/dependabot.yml`:

- Weekly npm dependency updates
- Max 5 open PRs at a time

---

## Troubleshooting

### Build Fails

```bash
pnpm build 2>&1 | tail -30
```

Common causes:

- Missing frontmatter fields in posts
- Invalid Markdown syntax
- TypeScript errors in src/

### Deployment Fails

```bash
wrangler pages deploy dist --project-name russellbrenner-com --branch main 2>&1
```

Common causes:

- Invalid API token (check Vault)
- Wrong account ID
- Project not created

### Custom Domain Not Working

1. Check DNS propagation:

   ```bash
   dig russellbrenner.com CNAME +short
   ```

2. Check Cloudflare Pages domain status:

   ```bash
   curl -s -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
     "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/russellbrenner-com/domains/russellbrenner.com" | jq
   ```

3. SSL provisioning can take 1-24 hours.

### Internal References Accidentally Committed

The sanitisation gate will block deployment. To fix:

```bash
grep -rn 'itsa\.house\|10\.0\.\|192\.168\.' site/ src/
# Replace matches, then recommit
```

---

## Metrics Refresh

Update site metrics from source files:

```bash
# Read fresh metrics
kubectl get deployments -A --no-headers | wc -l        # deployment count
kubectl get ns --no-headers | wc -l                     # namespace count
ls ~/.claude/skills/ | wc -l                            # skill count
ls ~/git/ | wc -l                                       # git repos count

# Edit ~/git/russellbrenner/facts/*.md with new values
# Then update content in this repo to match
```

---

## Contact

For issues or access:

- Vault: `secret/api/cloudflare` for API credentials
- GitHub: @russellbrenner
- Internal: Mattermost `#portfolio-site`
