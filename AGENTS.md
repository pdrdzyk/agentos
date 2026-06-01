<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Ship workflow

- After features or when the user says **push**: commit and `git push` to `origin` (see `.cursor/rules/auto-push-and-preview.mdc`).
- Hosting: GitHub `pdrdzyk/agentos` → Vercel. One-time setup: `DEPLOY.md`.
- After push, always reply with GitHub + Vercel view links.
