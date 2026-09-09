# Amsterdam 750 — Engineering Case Study

A public engineering case study by **Gerko Schrieken** exploring how a high-demand pre-registration flow can be designed to be simple, secure and scalable on Azure.

**Live case study:** https://gozzy82.github.io/amsterdam750-public/

## What this demonstrates

This project is intended as a portfolio case for recruiters and engineers. It demonstrates how I approach architecture rather than just implementation:

- translating a real-world scaling problem into a simpler system design;
- designing for large traffic spikes with serverless Azure components;
- protecting personally identifiable information with application-level envelope encryption;
- separating public registration and privileged administration responsibilities;
- reducing client complexity with progressive enhancement and HTMX;
- validating architectural claims with reproducible Azure Load Testing evidence;
- documenting assumptions, limitations and security trade-offs instead of hiding them.

## The problem

During the Amsterdam 750 ticket release, visitors could spend hours in a digital queue before reaching the registration flow. I used that public incident as the starting point for a narrower engineering question:

> What if pre-registration itself were designed as a short, stateless operation instead of keeping every visitor waiting in a browser session?

This repository is **not a reconstruction of the original ticketing system**. It isolates the pre-registration problem and explores an alternative architecture that can be tested independently.

## Architecture at a glance

```text
Browser + HTMX
      │
      ▼
Public Azure Function
      │
      ├── validation / anti-abuse / uniqueness
      │
      ▼
Azure Table Storage
      │
      ├── encrypted PII
      │
      └── wrapped per-record data keys
             │
             ▼
        Azure Key Vault

Registration accepted
      │
      ▼
Queue / asynchronous processing
      │
      └── invitation + OTP verification flow
```

The design deliberately keeps the synchronous registration path short while moving follow-up work out of the request path.

## Security design

The security model assumes that no single defensive layer is perfect.

Key measures include:

- **AES-256-GCM** application-level encryption for stored PII;
- per-record data encryption keys, wrapped using a Key Encryption Key in **Azure Key Vault**;
- **Managed Identity + RBAC** for access to cryptographic operations;
- separate public and privileged application responsibilities;
- hashed uniqueness locks instead of relying on plaintext identifiers;
- rate limiting and anti-abuse controls;
- auditability and monitoring;
- data minimisation.

The case study also explains an important limitation: encryption at rest does not protect data when an attacker obtains a legitimate application path with permission to decrypt it. The architecture therefore uses defence in depth rather than presenting encryption as a complete solution.

## Why HTMX

The pre-registration UI is fundamentally a form workflow, not a desktop application in a browser tab.

I deliberately chose server-rendered HTML with HTMX so that the browser can do what it already does well: forms, navigation, validation and accessible document rendering. This reduces client-side state and JavaScript without rejecting richer frameworks where they are actually useful.

The public portfolio site itself is even smaller: semantic HTML and CSS built with Vite, with no React runtime, application database or authentication layer.

## Verified load-test result

The published evidence contains a five-minute Azure Load Testing run with **250 virtual users**.

For the registration POST requests, the supplied raw results contain:

| Metric | Result |
| --- | ---: |
| Successful registrations | **126,124** |
| Failed HTTP requests | **0** |
| Calculated throughput | **420.57 requests/s** |
| p95 response time | **634 ms** |

CORS preflight traffic is reported separately. The methodology, original sanitized input/results, derived summary and SHA-256 checksums are published under `public/evidence/` so the numbers can be inspected rather than taken on trust.

## Repository structure

```text
index.html                         case-study content
styles.css                         presentation
public/evidence/                   load-test methodology and evidence
public/evidence/artifacts/         sanitized raw/derived artifacts
build/                             build helpers
.github/workflows/                 CI / GitHub Pages deployment
```

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Useful commands:

```text
npm run dev        local development server
npm run typecheck  TypeScript checks for Vite/build configuration
npm run lint       ESLint for configuration and tests
npm run build      production build
npm test           build plus HTML/link/asset checks
npm start          production preview
```

## Deployment and quality gates

The public case study is deployed from `main` to GitHub Pages. Every deployment first runs type checking, linting, the production build and automated checks on HTML, links and assets.

## Scope and evidence

This repository is intentionally a **sanitized public portfolio version**. It contains no real customer data, production secrets or private operational credentials.

The load-test material is included to make the performance claim reproducible, but one load test is not proof that every possible production workload will behave identically. The methodology page documents the interpretation and limitations.

## About the author

I am a senior software developer with a background in complex business applications, React/TypeScript and .NET, with a strong focus on Azure architecture, security and pragmatic system design.

This project is one example of how I like to work: simplify the problem first, make the security boundaries explicit, then test whether the architecture actually behaves as expected.
