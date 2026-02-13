# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ (current release) |

## Reporting a Vulnerability

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue.
2. Email `security@amazecode.com` with details.
3. Include reproduction steps, affected versions, and how we can validate.

We aim to respond within 48 hours.

## Dependency Management Policy

### Adding New Dependencies

Before introducing a new dependency:

1. Run `npm audit` on the package and review report output.
2. Check the project’s maintenance status (recent commits, open issues).
3. Determine if existing dependencies already provide the same behavior.
4. Document the rationale and security considerations in the pull request description.

### Prohibited/Restricted Dependencies

| Dependency | Status | Reason |
|------------|--------|--------|
| `next-mdx-remote` | **Prohibited** | Incompatible with the Create React App architecture |
| `@mdx-js/*` | Restricted | Requires architecture review and a compatible build pipeline |
| Any Next.js package | **Prohibited** | This project is built on Create React App, not Next.js |

### If MDX Support Becomes Necessary

If we ever need to support MDX:

1. Open an architecture discussion issue and document the use case.
2. Evaluate the options (e.g., migrate to Next.js, use a CRA-compatible MDX solution, or add custom bundler hooks).
3. Assess security implications before merging.
4. Update this policy once the architecture is agreed upon.

## Automated Security Scanning

- **npm audit**: runs on every pull request and weekly via GitHub Actions.
- **Trivy**: SBOM-based filesystem scan reports to the GitHub Security tab.
- **Dependabot**: Weekly dependency update PRs with grouping/labels.

## Incident Response

When a CVE alert occurs:

1. Verify whether the dependency exists (`npm ls <package-name>` / `grep -r "<package-name>" .`).
2. If it exists, create a high-priority issue and plan a remediation.
3. If it does not exist, investigate the alert origin (wrong branch/project, stale cache).
4. Document findings so the team can confirm the false positive and avoid duplicate work.
