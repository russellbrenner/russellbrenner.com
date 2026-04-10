# Security Policy

## Overview

This repository follows a defense-in-depth security approach with automated scanning at multiple layers. All security checks run on every push and pull request.

## Security Scanning Stack

### 1. TruffleHog — Deep Secret Detection

**What it does:** Scans entire git history for secrets, credentials, and API keys. Uses entropy analysis and pattern matching to detect both known and novel secret formats.

**Coverage:**

- Verified secrets only (reduces false positives)
- Full commit history scanning
- Detects rotated/revoked secrets

**Configuration:** Runs with `--only-verified` flag to minimize noise.

### 2. Gitleaks — Secret Detection

**What it does:** Fast, configurable secret detection using regex patterns and entropy detection.

**Coverage:**

- AWS credentials
- API keys (Google, GitHub, Stripe, etc.)
- Private keys
- Database connection strings
- JWT tokens

### 3. Semgrep — Static Analysis Security

**What it does:** Pattern-based static analysis for security vulnerabilities.

**Active configurations:**

- `p/security-audit` — General security issues
- `p/secrets` — Additional secret detection
- `p/owasp-top-10` — OWASP Top 10 vulnerabilities
- `p/jwt` — JWT-specific vulnerabilities
- `p/xss` — Cross-site scripting patterns
- `p/nodejs` — Node.js-specific security issues

### 4. Trivy — Dependency & Configuration Scanning

**What it does:** Comprehensive vulnerability scanner for dependencies, secrets, and infrastructure configuration.

**Coverage:**

- npm package vulnerabilities (CVEs)
- Embedded secrets in files
- Dockerfile security issues
- Kubernetes manifest misconfigurations

**Severity threshold:** CRITICAL, HIGH, MEDIUM

### 5. CodeQL — Semantic Code Analysis

**What it does:** Deep semantic analysis of JavaScript/TypeScript code for security vulnerabilities.

**Coverage:**

- SQL injection
- XSS (Cross-site scripting)
- Path traversal
- Command injection
- Prototype pollution
- Insecure deserialization

## Scan Schedule

| Scan Type               | Trigger                    |
| ----------------------- | -------------------------- |
| All tools               | Every push to `main`       |
| All tools               | Every pull request         |
| Full history TruffleHog | Weekly (Mondays 03:17 UTC) |

## Viewing Results

### GitHub Security Tab

All findings are automatically uploaded to the repository's Security tab:

- **Code Scanning:** CodeQL and Semgrep results
- **Secret Scanning:** TruffleHog and Gitleaks results
- **Dependency Scanning:** Trivy and Dependabot results

### Workflow Run Logs

Individual scan results appear in GitHub Actions run logs:

1. Go to **Actions** → **Security Scan**
2. Click on a run to see detailed output
3. Each tool outputs findings in its native format

## Responding to Findings

### Secrets Detected

1. **Immediately rotate** the exposed credential
2. **Revoke** the old credential
3. **Remove** the secret from git history (see below)
4. **Update** to use Vault or GitHub Secrets

**Removing secrets from git history:**

```bash
# Use BFG Repo-Cleaner (recommended)
java -jar bfg.jar --delete-files '*.{key,pem,env}'
# Or git filter-repo
git filter-repo --path .env --invert-path
```

### Vulnerabilities Detected

1. **CRITICAL:** Patch within 24 hours
2. **HIGH:** Patch within 7 days
3. **MEDIUM:** Patch within 30 days
4. **LOW:** Patch as able

**Updating vulnerable dependencies:**

```bash
pnpm update <package-name>
# Or let Dependabot handle it automatically
```

### CodeQL/Security Findings

1. Review the finding in the Security tab
2. Check if it's a true positive or false positive
3. Fix the underlying issue
4. If false positive, add annotation:

```javascript
// codeql[js/some-rule-name] OK: Reason for exception
```

## Secure Development Practices

### Environment Variables

**Never commit secrets.** Use:

- `.env.example` for documenting required variables (with placeholder values)
- GitHub Secrets for CI/CD
- Vault for production deployments

### Dependency Management

- Pin dependency versions in `package.json`
- Review `pnpm-lock.yaml` changes in PRs
- Enable Dependabot for automated security updates

### Input Handling

- Validate all user input
- Use parameterized queries (no string concatenation for SQL)
- Escape output to prevent XSS

## Security Contacts

- **Repository Owner:** @russellbrenner
- **Security Updates:** Monitor repository security advisories

## Acknowledgments

This security setup follows best practices from:

- [GitHub Security Lab](https://securitylab.github.com/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SANS Secure Coding Guidelines](https://www.sans.org/top25-software-errors/)
