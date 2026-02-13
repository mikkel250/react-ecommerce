# Vercel Security Alert Investigation & Dependency Audit Implementation - Technical Plan

## Overview

This plan addresses a Vercel security alert for CVE-2026-0969 (`next-mdx-remote`) received for a project that does **not** use this dependency. The investigation must:

1. Verify definitively that `next-mdx-remote` is not present in the codebase
2. Investigate potential Vercel configuration issues (wrong branch, cached build, or project mismatch)
3. Implement proactive security scanning to prevent future vulnerability blind spots
4. Document policy for future MDX-related dependencies

### Discovery Summary

**Current State Analysis:**
- **Project type**: React e-commerce app (Create React App) with Express backend
- **`next-mdx-remote` status**: **NOT PRESENT** - Verified via:
  - `npm ls next-mdx-remote` returns empty in both root and client
  - `grep` search returns no matches across entire codebase
  - Not listed in `package.json` (root or client)
  - Not found in `package-lock.json` (searched for "next-mdx" pattern)
- **Framework**: This is a CRA project, NOT Next.js - `next-mdx-remote` would be incompatible
- **Existing vulnerabilities**: Multiple known CVEs exist in current dependencies (body-parser, express, lodash, firebase dependencies, etc.)
- **CI/CD**: No GitHub Actions workflows exist; relies on Vercel auto-deploy
- **Git branches**: Multiple branches including `vercel-deployment`, `master`, and many dependabot branches

---

## Architecture

### Root Cause Hypotheses

| Hypothesis | Likelihood | Investigation |
|------------|------------|---------------|
| Vercel targeting wrong repository | Medium | Check Vercel dashboard project settings |
| Vercel targeting wrong branch (e.g., a branch with Next.js experiment) | Medium | Verify production branch in Vercel |
| Stale/cached Vercel build from previous config | Low | Check Vercel deployment history |
| Vercel alert system false positive or cross-project leak | Low | Contact Vercel support if others ruled out |
| Transitive dependency via another package | Very Low | Already verified via `npm ls` |

### Solution Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Security Hardening Architecture                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐    ┌──────────────────┐    ┌───────────────┐ │
│  │  GitHub Actions  │───▶│   npm audit +    │───▶│   Block PR/   │ │
│  │    Workflow      │    │   Snyk/Trivy     │    │   Deploy on   │ │
│  │                  │    │                  │    │   High CVE    │ │
│  └──────────────────┘    └──────────────────┘    └───────────────┘ │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────┐    ┌──────────────────┐                      │
│  │  Scheduled       │───▶│  Slack/Email     │                      │
│  │  Weekly Audit    │    │  Notifications   │                      │
│  └──────────────────┘    └──────────────────┘                      │
│                                                                      │
│  ┌──────────────────┐    ┌──────────────────┐                      │
│  │  SECURITY.md     │    │  .github/        │                      │
│  │  Policy Doc      │    │  dependabot.yml  │                      │
│  └──────────────────┘    └──────────────────┘                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Technology Choices

| Component | Tool | Rationale |
|-----------|------|-----------|
| Dependency audit | `npm audit` | Built-in, zero setup, runs on all package.json |
| SBOM scanning | Trivy or Snyk (free tier) | Deeper transitive dependency scanning |
| Automation | GitHub Actions | Native integration, free for public repos |
| Dependency updates | Dependabot | Already generating PRs (branches exist) |

---

## Implementation Phases

### Phase 1: Verification & Documentation (Immediate - P0)
**Goal**: Definitively prove `next-mdx-remote` is not in the codebase and document findings

- [x] Run `npm ls next-mdx-remote` in root and client directories
- [x] Search entire codebase for "next-mdx" or "mdx" patterns
- [x] Verify this is a CRA project (not Next.js)
- [x] Document current package.json dependencies
- [ ] **Create verification report** as comment/issue for team reference

**Verification Commands (Already Executed)**:
```bash
# Root directory
npm ls next-mdx-remote
# Result: (empty) - NOT FOUND

# Client directory  
cd client && npm ls next-mdx-remote
# Result: (empty) - NOT FOUND

# Full codebase search
grep -r "next-mdx-remote" .
# Result: No matches
```

**Dependencies**: None  
**Validation**: Documented proof that dependency does not exist

---

### Phase 2: Vercel Configuration Audit (P0)
**Goal**: Identify why Vercel sent an alert for a non-existent dependency

- [ ] Log into Vercel Dashboard
- [ ] Navigate to the project receiving the CVE alert
- [ ] **Verify the following settings**:
  - [ ] Correct GitHub repository is linked
  - [ ] Production branch is `master` (not an experimental branch)
  - [ ] Framework preset is "Create React App" or "Other" (NOT Next.js)
  - [ ] Build output directory is `client/build`
- [ ] Check deployment history for any Next.js-related builds
- [ ] Review if any preview deployments use different branches
- [ ] **Document Vercel project configuration** in findings

**Manual Steps Required**:
```
1. Go to https://vercel.com/dashboard
2. Select the project (likely "react-ecommerce" or "amazecode-clothing")
3. Settings → Git → Verify:
   - Repository: mikkel250/react-ecommerce (or similar)
   - Production Branch: master
4. Settings → General → Verify:
   - Framework Preset: Create React App
   - Root Directory: ./ or client
5. Deployments → Check recent deployment logs for any Next.js references
```

**Dependencies**: Phase 1 complete  
**Validation**: Screenshot or export of Vercel settings; root cause identified

---

### Phase 3: Implement npm Audit in CI/CD (P1)
**Goal**: Add automated security scanning on every push/PR

- [ ] Create `.github/workflows/security-audit.yml`
- [ ] Configure audit for both root and client `package.json`
- [ ] Set failure threshold (high/critical vulnerabilities)
- [ ] Add artifact upload for audit reports

**File to Create**: `.github/workflows/security-audit.yml`

```yaml
name: Security Audit

on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]
  schedule:
    # Run weekly on Monday at 9 AM UTC
    - cron: '0 9 * * 1'

jobs:
  audit:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        directory: ['.', 'client']
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: '${{ matrix.directory }}/package-lock.json'

      - name: Install dependencies
        run: npm ci
        working-directory: ${{ matrix.directory }}

      - name: Run npm audit
        run: |
          echo "## Security Audit Report - ${{ matrix.directory }}" >> $GITHUB_STEP_SUMMARY
          npm audit --audit-level=high 2>&1 | tee audit-report.txt || true
          
          # Fail on high/critical vulnerabilities
          npm audit --audit-level=high
        working-directory: ${{ matrix.directory }}
        continue-on-error: false

      - name: Upload audit report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: audit-report-${{ matrix.directory == '.' && 'root' || 'client' }}
          path: ${{ matrix.directory }}/audit-report.txt
          retention-days: 30
```

**Dependencies**: None (can run in parallel with Phase 2)  
**Validation**: 
- GitHub Action runs successfully on push
- Audit report artifact is generated
- Workflow fails when high/critical CVEs are present

---

### Phase 4: Enhanced Scanning with Trivy (P1)
**Goal**: Add SBOM-based scanning for deeper vulnerability detection

- [ ] Add Trivy scanning step to security workflow
- [ ] Generate SBOM (Software Bill of Materials)
- [ ] Configure severity thresholds
- [ ] Add GitHub Security tab integration

**Update to**: `.github/workflows/security-audit.yml`

```yaml
  trivy-scan:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'HIGH,CRITICAL'

      - name: Upload Trivy scan results to GitHub Security tab
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'
```

**Dependencies**: Phase 3 complete  
**Validation**: 
- Trivy scan runs without errors
- Results appear in GitHub Security tab
- SARIF file is properly formatted

---

### Phase 5: Dependabot Configuration (P1)
**Goal**: Formalize and configure automated dependency updates

- [ ] Create/update `.github/dependabot.yml`
- [ ] Configure update schedules for npm
- [ ] Set version update strategies
- [ ] Configure PR limits and labels

**File to Create**: `.github/dependabot.yml`

```yaml
version: 2
updates:
  # Root package.json (Express server)
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "UTC"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "security"
    commit-message:
      prefix: "chore(deps)"
    groups:
      production-dependencies:
        dependency-type: "production"
      development-dependencies:
        dependency-type: "development"

  # Client package.json (React app)
  - package-ecosystem: "npm"
    directory: "/client"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "UTC"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "security"
      - "frontend"
    commit-message:
      prefix: "chore(deps)"
    groups:
      react-ecosystem:
        patterns:
          - "react*"
          - "@types/react*"
      firebase:
        patterns:
          - "firebase*"
          - "@firebase/*"
```

**Dependencies**: None  
**Validation**: 
- Dependabot creates PRs on schedule
- PRs are properly labeled
- Grouping reduces PR noise

---

### Phase 6: Security Policy Documentation (P2)
**Goal**: Document security practices and MDX policy for team reference

- [ ] Create `SECURITY.md` with vulnerability reporting guidelines
- [ ] Document dependency addition policy
- [ ] Specifically address MDX/Next.js dependencies

**File to Create**: `SECURITY.md`

```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by:

1. **DO NOT** create a public GitHub issue
2. Email [security contact] with details
3. Include reproduction steps if possible

We will respond within 48 hours.

## Dependency Management Policy

### Adding New Dependencies

Before adding any new dependency:

1. **Check for known vulnerabilities**: `npm audit` the package
2. **Review maintenance status**: Check last commit date, open issues
3. **Evaluate necessity**: Can this be achieved with existing deps?
4. **Document rationale**: Add comment in PR explaining why needed

### Prohibited/Restricted Dependencies

| Dependency | Status | Reason |
|------------|--------|--------|
| `next-mdx-remote` | **Prohibited** | This is a CRA project; Next.js-specific deps are incompatible |
| `@mdx-js/*` | Restricted | Requires architecture review before adding |
| Any Next.js package | **Prohibited** | Project uses Create React App |

### If MDX Support is Needed in Future

This project currently does **not** support MDX. If MDX handling is required:

1. Open an architecture discussion issue first
2. Evaluate options:
   - Migrate to Next.js (major change)
   - Use `@mdx-js/react` with custom webpack config
   - Use a CRA-compatible MDX solution
3. Document security implications
4. Update this policy

## Automated Security Scanning

- **npm audit**: Runs on every PR and weekly
- **Trivy**: SBOM-based scanning on every PR
- **Dependabot**: Weekly dependency update PRs

## Incident Response

If a CVE alert is received:

1. **Verify the dependency exists** in our codebase
   ```bash
   npm ls <package-name>
   grep -r "<package-name>" .
   ```
2. If dependency exists: Create priority issue, evaluate fix options
3. If dependency does NOT exist: Investigate alert source (wrong project/branch)
4. Document findings in issue tracker
```

**Dependencies**: None  
**Validation**: 
- SECURITY.md renders correctly on GitHub
- Policy is clear and actionable

---

### Phase 7: Cleanup Existing Dependabot PRs (P2)
**Goal**: Address backlog of existing security PRs from dependabot

- [ ] Review existing dependabot branches (25+ branches exist)
- [ ] Prioritize by severity
- [ ] Merge or close stale branches
- [ ] Clean up remote branches after merge

**Current Dependabot Branches**:
```
remotes/origin/dependabot/npm_and_yarn/client/axios-0.21.1
remotes/origin/dependabot/npm_and_yarn/lodash-4.17.21
remotes/origin/dependabot/npm_and_yarn/client/handlebars-4.7.7
... (20+ more)
```

**Dependencies**: Phase 5 complete (new config may auto-close old PRs)  
**Validation**: Reduced open PR count; clear branch history

---

## Testing Strategy

### Unit Tests
- N/A for this security/configuration work

### Integration Tests
- [ ] GitHub Action runs on test branch push
- [ ] Audit correctly identifies known vulnerabilities
- [ ] Workflow fails appropriately on high-severity CVEs

### Manual Testing
| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| PR with vulnerable dep | Create PR adding old axios | Workflow fails, blocks merge |
| Clean PR | Create PR with no new deps | Workflow passes |
| Weekly scan | Wait for scheduled run (or trigger manually) | Report generated, no false positives |
| Vercel build | Deploy after config verified | No more `next-mdx-remote` alerts |

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Existing CVEs cause immediate CI failure | High | High | Use `continue-on-error` initially; fix existing issues first |
| Trivy false positives | Medium | Medium | Configure ignore file for known false positives |
| Vercel alert is a platform bug | Low | Low | Document and report to Vercel if investigation confirms |
| Breaking changes from dependency updates | Medium | Medium | Group updates; require manual review for major versions |
| GitHub Actions minutes exhaustion | Low | Low | Optimize caching; limit scheduled runs |

---

## Open Questions

- [ ] **Q1**: Is there a Vercel support ticket for this CVE alert? If not, should we open one?
- [ ] **Q2**: Are there other Vercel projects linked to this repository that might have Next.js?
- [ ] **Q3**: Should we implement Snyk instead of/alongside Trivy for commercial support?
- [ ] **Q4**: What is the team's appetite for addressing the ~50+ existing CVEs in dependencies?
- [ ] **Q5**: Is the `vercel-deployment` branch intended for production, or is it experimental?

---

## Success Criteria

- [ ] **Verification complete**: Documented proof that `next-mdx-remote` is not in codebase
- [ ] **Root cause identified**: Know why Vercel sent the alert (wrong project/branch/cache)
- [ ] **Alert resolved**: No further `next-mdx-remote` CVE alerts from Vercel
- [ ] **CI/CD security**: GitHub Actions workflow running on every PR
- [ ] **Automated updates**: Dependabot configured and creating grouped PRs
- [ ] **Documentation**: SECURITY.md published with MDX policy
- [ ] **No regressions**: Existing functionality unaffected

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/security-audit.yml` | Create | CI/CD security scanning |
| `.github/dependabot.yml` | Create | Automated dependency updates |
| `SECURITY.md` | Create | Security policy documentation |
| `vercel.json` | Verify | Ensure correct build configuration |

---

## Appendix: Current npm Audit Summary

### Root (`/package.json`)
```
Vulnerabilities found:
- body-parser <=1.20.2 (high)
- express <=4.21.0 (high - multiple CVEs)
- cookie <0.7.0 (moderate)
- lodash <=4.17.21 (high - multiple CVEs)
- hosted-git-info <2.8.9 (moderate)
- cross-spawn <6.0.6 (high)
- ansi-regex 3.0.0 (high)
```

### Client (`/client/package.json`)
```
Vulnerabilities found:
- @grpc/grpc-js (via firebase) - moderate
- ansi-html (via react-scripts) - high
- Multiple react-scripts transitive deps - various severities
```

**Recommendation**: Address root package vulnerabilities first (fewer breaking changes expected); client vulnerabilities may require react-scripts upgrade which is a larger effort.
