This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

This repository uses pnpm 10 and Node.js 24. Install dependencies and start the
development server:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Environment variables

Environment variables are validated with [T3 Env](https://env.t3.gg). Add server-only and `NEXT_PUBLIC_` variables to `app/env.ts`, include them in `runtimeEnv`, and import the exported `env` object instead of reading `process.env` throughout the application.

The schema is imported by `next.config.ts`, so invalid variables fail fast when
the development server or production build starts. Copy `.env.example` to
`.env.local` for local-only values. `NEXT_PUBLIC_API_URL` is the public base URL
of the NestJS API. Development and tests default to `/api/mock` when it is unset.
Production has no fallback: a request made there without configuration rejects
with the normalized `MISSING_CONFIGURATION` application error. `NODE_ENV` is
supplied by Next.js and validated.

The example environment points to `/api/mock`, a same-origin Next.js Route
Handler implementing the sample users domain. This keeps local development
self-contained. Replace it with an absolute NestJS URL when the backend is
available. Relative URLs are intentionally browser-only; server-side API calls
must use an absolute URL.

When variables are added, configure separate values in Vercel under Project
Settings → Environment Variables for Development, Preview, and Production. Do not
put secrets in `NEXT_PUBLIC_*`. CI should only receive safe build-time values that
the build genuinely requires.

## API data and errors

Client-side server state follows one path:

```text
React component → TanStack Query → domain API → HTTP client → Axios → NestJS
NestJS response → JSON parsing → Zod validation → typed data or AppError
AppError → TanStack Query → UI error mapper
```

`app/providers.tsx` owns the shared browser `QueryClient`. Query definitions are
kept beside their domain, such as `lib/api/users/users.queries.ts`; components can
pass those definitions directly to `useQuery` or `useMutation`. Query functions
forward TanStack Query's abort signal, and the shared retry policy makes at most
one retry for network failures, timeouts, and selected transient 5xx responses.

`lib/api/axios-instance.ts` contains the application's single configured Axios
instance. It owns the base URL, 10-second timeout, common headers, optional bearer
token injection, and response-error normalization. Register the application's
token reader once with `configureApiAccessToken()` when authentication is added;
individual components and domain modules must not add authorization headers.
There is no refresh interceptor until the application has a real session and
refresh-token contract.

`lib/api/client.ts` wraps that instance and owns request bodies and endpoint Zod
validation. External responses must pass the endpoint's schema. Malformed JSON or
schema mismatches reject as `contract / INVALID_API_RESPONSE`; unvalidated data is
never returned. The wrapper also normalizes errors from injected Axios instances,
which keeps isolated tests and future specialized call sites on the same contract.

NestJS errors should use this stable contract:

```json
{
  "statusCode": 409,
  "code": "EMAIL_ALREADY_EXISTS",
  "message": "Email already exists",
  "data": { "field": "email" }
}
```

The frontend trusts `code` and `data` only after the payload passes its Zod schema
and `statusCode` matches the actual HTTP status. HTML, malformed JSON, and other
unexpected error bodies fall back to `HTTP_<status>`. UI code should call
`mapError()` and use its presentation hint and localized-message key; it should
not render the backend message or inspect raw Axios/Zod errors. Raw `AxiosError`
instances are retained only as `AppError.originalError` for internal diagnostics.

The bundled mock supports `GET /api/mock/users/:id` and
`POST /api/mock/users`. It validates create-user input and deliberately provides
`NOT_FOUND`, `VALIDATION_ERROR`, and `EMAIL_ALREADY_EXISTS` responses using the
same contract expected from NestJS. It is a development fixture, not an
authentication or persistence layer.

## Tests and local validation

```bash
pnpm lint
pnpm typecheck
pnpm test:ci
pnpm build
pnpm test:e2e
```

Vitest and React Testing Library cover unit/component tests in `__tests__/`.
`pnpm test` and `pnpm test:ci` are non-interactive; use `pnpm test:watch` while
developing.

Playwright tests live in `e2e/`. Locally, `pnpm test:e2e` starts (or reuses) the
Next.js development server at `http://localhost:3000` and runs Chromium, Firefox,
and WebKit. Install local browser binaries once with `pnpm exec playwright install`.
Set `PLAYWRIGHT_TEST_BASE_URL` to test an already-deployed URL instead.

## CI/CD

The GitHub Actions workflow in `.github/workflows/ci.yml` runs on pull requests to
`main` and pushes to `main`. Its `Quality` job installs with the frozen pnpm
lockfile, then runs lint, TypeScript, Vitest, and the production Next.js build.

On pull requests, `Preview E2E` starts after `Quality` succeeds. It waits for the
Vercel Git integration's `Preview` GitHub Deployment for the exact PR head commit,
uses the deployment URL returned by GitHub, and runs the smoke suite in Chromium.
There is no arbitrary sleep, Vercel token, Vercel CLI, or deployment command in
GitHub Actions. A failed Vercel build or timeout fails the E2E job. Failed
Playwright reports are retained as workflow artifacts for seven days.

Vercel remains the deployment owner:

- A pull request or non-production branch creates a Vercel Preview Deployment.
- Merging to `main` creates a Vercel Production Deployment.
- The push to `main` also reruns the `Quality` job; GitHub Actions does not deploy.

### Required one-time repository configuration

1. Import this GitHub repository into a single Vercel project, leave Git deployments
   enabled, and set `main` as the Production Branch. The workflow expects the
   integration's conventional GitHub Deployment name `Preview` and commit status
   `Vercel`. If this repository later maps to multiple Vercel projects, set the
   `project-slug` input on `vercel/wait-for-deployment-action`.
2. Add application variables in Vercel with the correct Development, Preview, and
   Production scopes. No application-specific variables are currently required.
3. If Preview Deployment Protection is enabled, create a Vercel Protection Bypass
   for Automation and add the same value as the GitHub Actions repository secret
   `VERCEL_AUTOMATION_BYPASS_SECRET`. The Playwright configuration sends it only as
   the documented protection headers and disables traces so the header cannot be
   retained in an artifact. Public previews do not require this secret.
4. In the `main` branch protection ruleset, require a pull request and the `Quality`
   and `Preview E2E` checks. Also require the Vercel deployment/status check exposed
   by the Git integration (normally `Vercel`). Require branches to be up to date if
   that matches the team's merge policy.

Vercel must be connected before making `Preview E2E` required; otherwise the job
will time out because no `Preview` deployment exists. Vercel may require explicit
authorization before it deploys pull requests from external forks, so those PRs
can require a maintainer-approved deployment before E2E can complete.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
