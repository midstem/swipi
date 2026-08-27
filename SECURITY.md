# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Swipi, **please do not open a public
issue.** Instead, report it responsibly through one of the following channels:

- **GitHub Security Advisories** (preferred): Go to the
  [Security Advisories](https://github.com/midstem/swipi/security/advisories/new)
  page and create a new advisory. This allows us to discuss the issue privately
  and coordinate a fix before public disclosure.
- **Email**: Send a report to **midstem.development@gmail.com** with the subject
  line `[SECURITY] Swipi — <brief description>`.

### What to Include

- A description of the vulnerability and its potential impact
- Steps to reproduce the issue
- The affected package(s) and version(s)
- Any suggested fix, if you have one

### What to Expect

- We will acknowledge your report within **3 business days**.
- We will work with you to understand the scope and severity of the issue.
- We will release a fix as soon as possible, depending on the complexity.
- We will credit you in the release notes (unless you prefer to remain
  anonymous).

## Supported Versions

We provide security fixes for the **latest released version** of each package.
Older versions do not receive backported fixes — please upgrade to the latest
version.

| Package                  | Supported         |
| ------------------------ | ----------------- |
| `@midstem/swipi`         | Latest version ✅ |
| `@midstem/swipi-react`   | Latest version ✅ |
| `@midstem/swipi-vue`     | Latest version ✅ |
| `@midstem/swipi-svelte`  | Latest version ✅ |
| `@midstem/swipi-angular` | Latest version ✅ |

## Scope

Swipi is a client-side UI library. Its attack surface is limited to DOM
manipulation and event handling. That said, we take all reports seriously and
encourage responsible disclosure of any issue you find.
